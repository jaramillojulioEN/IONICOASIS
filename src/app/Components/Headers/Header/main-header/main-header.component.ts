import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { UserServiceService } from 'src/app/services/Users/user-service.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  constructor(private menu: MenuController, private us : UserServiceService,
    private md : ModalController,
    protected navCtrl : NavController
  ) { }
  @Input() titulo: string = ""
  @Input() isModal: boolean = false
  
  user : any = []
  ngOnInit() {
    this.user = this.us.getUser()
  }

  goBack() {
    this.navCtrl.back();
  }

  openFirst() {
    this.menu.toggle('second-menu');
  }

  dissmiss(){
    this.md.dismiss()
  }
}
