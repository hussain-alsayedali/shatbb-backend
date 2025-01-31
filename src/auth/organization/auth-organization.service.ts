import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { OrganizaitionSignupDto } from '../dto/organization-signup.dto';
import { FirebaseCollections } from 'src/common/constants/firebase-collections';
import * as argon2 from 'argon2';
import * as admin from 'firebase-admin';
import { UserRole } from '../decorator/roles.decorator';

@Injectable()
export class AuthOrganizationService {
  constructor(private firebaseService: FirebaseService) {}

  async signup(dto: OrganizaitionSignupDto) {
    try {
      const db = this.firebaseService.getFirestore();
      const auth = this.firebaseService.getAuth();

      // Check if customer already exists
      const existingCustomer = await db
        .collection(FirebaseCollections.ORGANIZATION)
        .where('email', '==', dto.email)
        .get();

      if (!existingCustomer.empty) {
        throw new HttpException(
          'Customer with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Hash password
      const hashedPassword = await argon2.hash(dto.password);

      // Create Firebase auth user
      const userRecord = await this.firebaseService.getAuth().createUser({
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        password: dto.password,
      });

      // Prepare customer document
      const organizaitionDoc = {
        organizaitionName: dto.organizaitionName,
        organizaitionNameEnglish: dto.organizaitionNameEnglish,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        uid: userRecord.uid,
        hash: hashedPassword,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Start transaction
      return await db.runTransaction(async (transaction) => {
        // Set customer document in transaction
        const customerRef = db
          .collection(FirebaseCollections.ORGANIZATION)
          .doc(userRecord.uid);
        transaction.set(customerRef, organizaitionDoc);

        // Set custom claims
        await this.firebaseService
          .getAuth()
          .setCustomUserClaims(userRecord.uid, {
            role: UserRole.ORGANIZATION_MANAGER,
          });

        // Generate a custom token
        const customToken = await this.firebaseService
          .getAuth()
          .createCustomToken(userRecord.uid);

        return {
          message: 'Organizaition created successfully',
          uid: userRecord.uid,
          customToken,
        };
      });
    } catch (error) {
      console.error(
        `Failed to create Organizaition: ${error.message}`,
        error.stack,
      );

      if (error.code === 'auth/email-already-exists') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw new HttpException(
        'Failed to create customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
