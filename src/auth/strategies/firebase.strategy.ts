import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private firebaseService: FirebaseService) {
    super();
  }

  async validate(request: any): Promise<any> {
    const authHeader = request.headers.authorization;

    if (!authHeader) return null;

    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);

      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  authenticate(req: any) {
    this.validate(req)
      .then((user) =>
        user ? this.success(user) : this.fail('Unauthorized', 401),
      )
      .catch((error) => this.error(error));
  }
}
