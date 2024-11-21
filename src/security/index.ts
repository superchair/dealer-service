import { Request } from "express"
import * as jwt from "jsonwebtoken"
import jwksRsa from "jwks-rsa"

const jwksUri: string = "https://dev-0k8m6aqc.us.auth0.com/.well-known/jwks.json"
const audience: string = "platform-services"
const issuer: string = "https://dev-0k8m6aqc.us.auth0.com/"

const client = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri
});

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'auth0') {
    const token = request.headers['authorization'] ?? '';

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }


      function getKey(header: any, callback: any) {
        client.getSigningKey(header.kid, function(err, key: any) {
          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey)
        });
      }

      jwt.verify(token, getKey, function(err: any, decoded: any) {
        if (err) {
          reject(new Error(err));
        } else {
          console.log(decoded)
          if (decoded.aud != audience) {
            reject(new Error('JWT error'));
          }
          console.log('iss: ', decoded.iss);
          if (decoded.iss != issuer) {
            reject(new Error('JWT error'));
          }

          if (scopes && scopes.length > 0) {
            const tokenScopes: Array<string> = decoded.scope.split(' ');
            const allowed = scopes.every((requiredScope) => tokenScopes.includes(requiredScope));
            if (!allowed) {
              reject(new Error('JWT scopes error'));
            }
          }
          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new Error('No token provided'));
}
