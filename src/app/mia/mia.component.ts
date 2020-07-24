import { AfterViewInit, Component, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, OnInit } from '@angular/core';
import {
  MenuToggleService
} from 'src/shared/services/menu-toggle.service';
import { CrudService } from 'src/shared/services/crud.service';


@Component({
  selector: 'mia',
  templateUrl: './mia.component.html',
  styleUrls: ['./mia.component.scss']
})
export class MiaComponent implements AfterViewInit {

  // AUTOSCROLL
  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private isNearBottom = true;

  richCard: boolean;
  messages = [];
  loading = false;

  constructor(
    public sideNavService: MenuToggleService,
    public crudService: CrudService
  ) {}

  ngAfterViewInit() {
    // AUTOSCROLL
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

  this.crudService.messageInit().get().toPromise().then(snapshot => {
      if (snapshot.empty) {
        //TODO: Fix Bug where this initial message doesn't show up
        this.crudService.addBotMessage({fulfillmentText: "My name is Matilda, and I’m here to help you find work opportunities that match you best! Just say \"Let's find a job\" to get started."});
        return
      }
    })
    this.crudService.messageInit().valueChanges().subscribe(data => {
      this.messages = data

      this.crudService.messageInit().get().toPromise().then(snapshot => {
        if (snapshot.empty) {
          //TODO: Fix Bug where this initial message doesn't show up
          this.crudService.addBotMessage({fulfillmentText: "My name is Matilda, and I’m here to help you find work opportunities that match you best! Just say \"Let's find a job\" to get started."});
          return
        }
      })

    })

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


  // Get event from ChatFormComponent
  handleUserMessage(event) {
    this.loading = true
    this.crudService.handleUserMessage(event).subscribe(res => {
      //Uploads bot message to Firestore database
      this.crudService.addBotMessage(res);
      this.loading = false;
    });
  }



}
