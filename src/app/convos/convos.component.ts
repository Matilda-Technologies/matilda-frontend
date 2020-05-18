import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.scss']
})
export class ConvosComponent implements OnInit {

  items: Array<any>;
  searchValue: string="";
  org_filtered_items: Array<any>;

  constructor(
    public firebaseService: FirebaseService,
    private afAuth: AuthenticationService,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
    // Load conversations
    const u = JSON.parse(localStorage.getItem('user'));
    const uid = u.uid;
    this.firebaseService.getItems(uid)
    .subscribe(result => {
      this.items = result;
    })
  }
  
  searchByOrg() {
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchOrganization(value)
    .subscribe(result => {
      this.org_filtered_items = result;
      this.items = this.org_filtered_items;
    });
    }
}
