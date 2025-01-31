import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UserDocInterceptor implements NestInterceptor {
  constructor(private firebaseService: FirebaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const decodedToken = request.user;

    if (decodedToken && decodedToken.role && decodedToken.uid) {
      const docRef = this.firebaseService
        .getFirestore()
        .collection('organizations')
        .doc(decodedToken.uid);

      const doc = await docRef.get();

      try {
        const doc = await docRef.get();
        if (doc.exists) {
          request.userDoc = doc.data();
        } else {
          request.userDoc = {}; // Set to empty object if document doesn't exist
          console.log('user dont exist in user doc interceptor');
        }
      } catch (error) {
        console.error('Error fetching user document:', error.message);
        request.userDoc = {}; // Fallback to empty object
      }
    }

    return next.handle();
  }
}
