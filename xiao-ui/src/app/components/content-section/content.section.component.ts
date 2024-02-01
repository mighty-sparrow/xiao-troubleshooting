import { CommonModule } from "@angular/common";
import {
  Component,
  Directive,
  Input,
  TemplateRef,
  ContentChild,
  HostBinding,
  HostListener,
  ElementRef,
} from "@angular/core";
import { BackgroundImageDirective } from "./background.image.url.directive";

let nextId = 0;

@Directive({
  selector: "[ContentSection]",
})
export class AppContentDirective {
  constructor(public tRef: TemplateRef<unknown>) {}
}

@Component({
  selector: "content-section",
  templateUrl: "content.section.component.html",
  styleUrls: ["content.section.component.scss"],
  standalone: true,
  imports: [CommonModule],
  inputs: ["bgImage"],
})
export class ContentSectionComponent {
  // @HostBinding("style.background-image")
  // bgImage?: string;
  public _bgImage: any = {};

  contentId = `app-cs-${nextId++}`;
  @ContentChild(AppContentDirective) content!: AppContentDirective;
  @ContentChild(BackgroundImageDirective)
  backgroundImageUrl!: BackgroundImageDirective;

  @Input()
  set bgImage(value: any) {
    this.bgImage = value;
  }
  get bgImage(): any {
    return "background-image: url('" + this.bgImage + "');";
  }
}
