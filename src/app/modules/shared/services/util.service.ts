import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keyclokeService: KeycloakService) { }

  getRoles(){
    return this.keyclokeService.getUserRoles();
  }

  isAdmin(){
    let roles = this.keyclokeService.getUserRoles().filter( role => role == "admin");

    if(roles.length > 0){
      return true;
    }
    else{
      return false;
    }
  }
}
