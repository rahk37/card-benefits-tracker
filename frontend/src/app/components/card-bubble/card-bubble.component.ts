import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../../models/credit-card.model';

@Component({
  selector: 'app-card-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-bubble.component.html',
  styleUrls: ['./card-bubble.component.scss']
})
export class CardBubbleComponent {
  @Input({ required: true }) card!: CreditCard;
  @Input() selected = false;
  @Output() toggle = new EventEmitter<number>();

  onToggle(): void {
    this.toggle.emit(this.card.id);
  }
}
