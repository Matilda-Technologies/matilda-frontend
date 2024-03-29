import { AfterViewInit, Component, ViewChild, ViewChildren, ElementRef, QueryList, OnInit } from '@angular/core';
import {
  MenuToggleService
} from 'src/shared/services/menu-toggle.service';
import { CrudService } from 'src/shared/services/crud.service';
import { UserService } from 'src/shared/services/user.service';


@Component({
  selector: 'mia',
  templateUrl: './mia.component.html',
  styleUrls: ['./mia.component.scss']
})
export class MiaComponent implements OnInit {

  // AUTOSCROLL
  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private isNearBottom = true;

  richCard: boolean;
  messages = [];
  loading = false;

  showChips: boolean = false;
  chips = [];

  constructor(
    public sideNavService: MenuToggleService,
    public crudService: CrudService,
    public afAuth: UserService,

  ) {}

  ngOnInit() {
    this.crudService.delay(500).then(()=> {

      this.crudService.messageInit().get().toPromise().then(snapshot => {
        if (snapshot.empty) {
          this.crudService.addBotMessage({fulfillmentText: "My name is Matilda, and I’m here to help you find work opportunities that match you best! Just say \"Let's find a job\" to get started."});
        }
      })
      this.crudService.messageInit().valueChanges().subscribe(data => {
        this.messages = data

        try {

        if (this.messages[this.messages.length-1].text == "Would you like to try again?") {
          this.chips = ["Yes, let's find a new job", "No thanks"]
          this.showChips = true

        }

        else if (this.messages[this.messages.length-1].text == "My name is Matilda, and I’m here to help you find work opportunities that match you best! Just say \"Let's find a job\" to get started.") {
          this.chips = ["Let's find a new job!"]
          this.showChips = true

        } else if (this.messages[this.messages.length-1].text == "Are you looking for a full-time or part-time job?") {
          this.chips = ["Full-time", "Part-time"]
          this.showChips = true

        } else if (this.messages[this.messages.length-1].text == "Hopefully you find an interesting opportunity! If not, we can always look for something else.") {
          this.chips = ["Let's find a new job!"]
          this.showChips = true

        }

        } catch {

        }


        //Necessary for initally message to show up
        this.crudService.messageInit().get().toPromise().then(snapshot => {
          if (snapshot.empty) {
            //TODO: Fix Bug where this initial message doesn't show up
            this.crudService.addBotMessage({fulfillmentText: "My name is Matilda, and I’m here to help you find work opportunities that match you best! Just say \"Let's find a job\" to get started."});

          }
        })

      })


    })



  }

  ngAfterViewInit() {
    // AUTOSCROLL
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

  }

  // AUTOSCROLL
  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  ensureNotNull(variable) {
    while (variable == null) {
      setTimeout(function () {}, 500);
    }

    return variable
  }

  addChipMessage(chipText) {
    this.showChips = false
    this.handleUserMessage({message: chipText})

  }


  // Get event from ChatFormComponent
  handleUserMessage(event) {
    this.loading = true
    this.showChips = false;
    this.crudService.handleUserMessage(event).subscribe(res => {
      //Uploads bot message to Firestore database
      this.crudService.addBotMessage(res);

      this.loading = false;
    });
  }



}
