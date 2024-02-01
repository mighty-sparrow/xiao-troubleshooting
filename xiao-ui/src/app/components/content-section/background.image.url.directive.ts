import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  standalone: true,
  selector: "[appBackgroundImage]",
})
export class BackgroundImageDirective {
  @Input() imageUrl!: string;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundImage = `url('${this.imageUrl}')`;
  }
}
