import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            domain: configService.get<string>('AUTH0_DOMAIN'),
            clientID: configService.get<string>('AUTH0_CLIENT_ID'),
            clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
            callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
            scope: 'openid email profile',
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        extraParams: Record<string, any>,
        profile: any,
        done: (err: any, user: any, info?: any) => void,
    ): void {
        done(null, profile);
    }
}