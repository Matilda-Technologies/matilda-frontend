  import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild }from '@angular/core';
  import { CrudService } from 'src/shared/services/crud.service';
  import { UserService } from 'src/shared/services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserProfileService } from 'src/shared/services/user-profile.service';
import { NONE_TYPE } from '@angular/compiler';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalytics } from '@angular/fire/analytics';

  @Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
  })
  export class ProfileComponent implements OnInit {

    valueHidden: boolean = false;
    inputHidden: boolean = true;
    coverDownloadURL: string;
    profileDownloadURL: string;
    uploadProgress;
    showResumeUploaded = false;
    user;
    userId: string = JSON.parse(localStorage.getItem('user')).uid;
    resumeEvent;


    @Output() loaded = new EventEmitter();
    @ViewChild('banner') banner: ElementRef;


    constructor(
      public crudService: CrudService,
      public profileService: UserProfileService,
      public afAuth: UserService,
      public router: Router,
      public afStorage: AngularFireStorage,
      public db: AngularFirestore,
      public analytics: AngularFireAnalytics) {}

    ngOnInit(): void {
      this.crudService.pathRefresh()

      this.crudService.delay(500).then(()=> {

        this.userId = JSON.parse(localStorage.getItem('user')).uid;

        this.db.doc(`users/${this.userId}`).valueChanges().subscribe(data => {
          this.user = data
          this.loaded.emit()

        });

      })



      this.afStorage.ref(`/coverImages/${this.userId}`).getDownloadURL().toPromise().then(data => this.coverDownloadURL = data)

      this.afStorage.ref(`/profileImages/${this.userId}`).getDownloadURL().toPromise().then(data => {
        this.profileDownloadURL = data;
        if (!this.profileDownloadURL) {
          this.profileDownloadURL = this.afAuth.userData.photoURL
        }

        if (!this.profileDownloadURL) {
          this.profileDownloadURL = "/assets/boy.png";
        }

      })

      this.afStorage.ref(`/resumes/${this.userId}`).getDownloadURL().toPromise().then(data => {
        if (data) {
          this.showResumeUploaded = true
        }

      })

      this.section = 0;


    }

  resetEdits() {
    this.profileService.editingName = false
    this.profileService.editingDOB = false
    this.profileService.editingEducation = false
    this.profileService.editingEmail = false
    this.profileService.editingEmailFrequency = false
    this.profileService.editingExperience = false
    this.profileService.editingGender = false
    this.profileService.editingHonors = false
    this.profileService.editingInterests = false
    this.profileService.editingLanguages = false
    this.profileService.editingName = false
    this.profileService.editingPassword = false
    this.profileService.editingPhone = false
    this.profileService.editingSkills = false
    this.profileService.editingSocialLinks = false
    this.profileService.editingValues = false

  }


    // PROFILE NAV
    section = 0;


    uploadBanner(event) {
      let userId = JSON.parse(localStorage.getItem('user')).uid;
      this.afStorage.upload(`/coverImages/${userId}`, event.target.files[0]);

      let ref = this.afStorage.ref(userId);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      ref.put(event.target.files[0]).percentageChanges().toPromise()
      .then(() => this.analytics.logEvent("uploaded_banner"))
      .then(data => window.location.reload());
    }



    uploadResume(event) {
      let userId = JSON.parse(localStorage.getItem('user')).uid;
      let reference = this.afStorage.ref(`/resumes/${userId}`);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      reference.put(event.target.files[0]).percentageChanges().toPromise()
      .then(() => this.analytics.logEvent("uploaded_resume"))
      .then(data => window.location.reload());
    }

    uploadProfile(event) {

      let userId = JSON.parse(localStorage.getItem('user')).uid;
      this.afStorage.upload(`/profileImages/${userId}`, event.target.files[0]);

      let ref = this.afStorage.ref(userId);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      ref.put(event.target.files[0]).percentageChanges().toPromise()
      .then(() => this.analytics.logEvent("uploaded_avatar"))
      .then(data => window.location.reload());
    }


  }
