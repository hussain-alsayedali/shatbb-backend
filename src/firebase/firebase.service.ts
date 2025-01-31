import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;
  private firestore: admin.firestore.Firestore; // Firestore as a variable
  private auth: admin.auth.Auth; // Auth as a variable
  private storage: admin.storage.Storage;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
    this.firestore = this.firebaseApp.firestore(); // Eager initialization for Firestore
    this.auth = this.firebaseApp.auth(); // Eager initialization for Auth
    this.storage = this.firebaseApp.storage();
  }

  private initializeFirebase() {
    const firebaseConfig = this.getFirebaseConfig();

    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        storageBucket: `${firebaseConfig.projectId}.firebasestorage.app`,
      });
      console.log('Firebase is initalized');
    } else {
      this.firebaseApp = admin.app();
    }
  }

  private getFirebaseConfig(): admin.ServiceAccount {
    return {
      projectId: this.configService.get<string>('PROJECT_ID'),
      clientEmail: this.configService.get<string>('CLIENT_EMAIL'),
      privateKey: this.configService
        .get<string>('PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
    };
  }

  private ensureInitialized() {
    if (!this.firebaseApp) {
      throw new Error('Firebase app is not initialized');
    }
  }

  getFirestore(): admin.firestore.Firestore {
    this.ensureInitialized();
    return this.firestore; // Return the eagerly initialized Firestore instance
  }

  getAuth(): admin.auth.Auth {
    this.ensureInitialized();
    return this.auth; // Return the eagerly initialized Auth instance
  }

  getURLSignIn(): string {
    const apiKey = this.configService.get<string>('WEB_API_KEY');
    return `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  }
  getURLApiKey(): string {
    return this.configService.get<string>('WEB_API_KEY');
  }

  getURLSignInCustomeToken(): string {
    const apiKey = this.configService.get<string>('WEB_API_KEY');
    const FIREBASE_SIGN_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
    return FIREBASE_SIGN_IN_URL;
  }

  getStorage(): admin.storage.Storage {
    this.ensureInitialized();
    return this.storage;
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const bucket = this.getStorage().bucket(); // Uses the default bucket from initialization
    const fileName = `${path}/${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(new Error(`File upload failed: ${error.message}`));
      });

      stream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await fileUpload.makePublic();

          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
        } catch (error) {
          reject(new Error(`Failed to make file public: ${error.message}`));
        }
      });

      // Write the buffer to the stream
      stream.end(file.buffer);
    });
  }
}
