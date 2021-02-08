import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { validarQueSeanIguales } from '../app.validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})


export class RegisterPage implements OnInit {

  usuario: FormGroup;
  
  


  constructor(private authSvc:AuthService, private router: Router, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.usuario = this.formBuilder.group({
      email: new FormControl('', Validators.email),
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarPassword : new FormControl('',[Validators.required, Validators.minLength(6)])
    },{
      validators: validarQueSeanIguales
    });


  }

  
  checarSiSonIguales(): boolean {
    return this.usuario.hasError('noSonIguales') &&
      this.usuario.get('password').dirty &&
      this.usuario.get('confirmarPassword').dirty;
  }


  async onRegister(email,password){

    try {
      const user = await this.authSvc.register(email.value, password.value);
      
      if (user){ //Verificar si usuario esta verificado
        console.log('User ->', user);
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log("Error ->", error);
    }
  }

  private redirectUser(isVerified:boolean): void{
    if (isVerified) {
      //redireccionar a admin
      this.router.navigate(['confirmar']);
    } else {
      this.router.navigate(['verify-email']);
      //else pagina de verificacion
    }
  }

  async registrarse(){
    try {
      const user = await this.authSvc.register(this.usuario.value.email, this.usuario.value.password);
      
      if (user){ //Verificar si usuario esta verificado
        console.log('User ->', user);
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log("Error ->", error);
    }
    
  }


}
