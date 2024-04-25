import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { PrimeTemplate } from '@primeng/api';

/**
 * Button is an extension to standard button element with icons and theming.
 * @group Components
 */
@Component({
  selector: 'p-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './button.component.scss',
  host: {
    class: 'p-element',
    '[class.p-disabled]': 'disabled' || 'loading'
  }
})
export class ButtonComponent implements AfterContentInit {
  /**
   * Type of the button.
   * @group Props
   */
  @Input() type = 'button';
  /**
   * Position of the icon.
   * @group Props
   */
  @Input() iconPos = 'left';
  /**
   * Name of the icon.
   * @group Props
   */
  @Input() icon: string | undefined;
  /**
   * Value of the badge.
   * @group Props
   */
  @Input() badge: string | undefined;
  /**
   * Uses to pass attributes to the label's DOM element.
   * @group Props
   */
  @Input() label: string | undefined;
  /**
   * When present, it specifies that the component should be disabled.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) disabled: boolean | undefined;
  /**
   * Whether the button is in loading state.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) loading = false;
  /**
   * Icon to display in loading state.
   * @group Props
   */
  @Input() loadingIcon: string | undefined;
  /**
   * Add a shadow to indicate elevation.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) raised = false;
  /**
   * Add a circular border radius to the button.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) rounded = false;
  /**
   * Add a textual class to the button without a background initially.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) text = false;
  /**
   * Add a plain textual class to the button without a background initially.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) plain = false;
  /**
   * Defines the style of the button.
   * @group Props
   */
  @Input() severity: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast' | string | undefined;
  /**
   * Add a border class without a background initially.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) outlined = false;
  /**
   * Add a link style to the button.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) link = false;
  /**
   * Add a tabindex to the button.
   * @group Props
   */
  @Input({ transform: numberAttribute }) tabindex: number | undefined;
  /**
   * Defines the size of the button.
   * @group Props
   */
  @Input() size: 'small' | 'large' | undefined;
  /**
   * Inline style of the element.
   * @group Props
   */
  @Input() style: { [klass: string]: any } | null | undefined;
  /**
   * Class of the element.
   * @group Props
   */
  @Input() styleClass: string | undefined;
  /**
   * Style class of the badge.
   * @group Props
   */
  @Input() badgeClass: string | undefined;
  /**
   * Used to define a string that autocomplete attribute the current element.
   * @group Props
   */
  @Input() ariaLabel: string | undefined;
  @Output() onClick: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  contentTemplate: TemplateRef<any> | undefined;

  loadingIconTemplate: TemplateRef<any> | undefined;

  iconTemplate: TemplateRef<any> | undefined;

  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

  constructor(public el: ElementRef) {}

  get buttonClass() {
    return {
      'p-button p-component': true,
      'p-button-icon-only': (this.icon || this.iconTemplate || this.loadingIcon || this.loadingIconTemplate) && !this.label,
      'p-button-vertical': (this.iconPos === 'top' || this.iconPos === 'bottom') && this.label,
      'p-disabled': this.disabled || this.loading,
      'p-button-loading': this.loading,
      'p-button-loading-label-only': this.loading && !this.icon && this.label && !this.loadingIcon && this.iconPos === 'left',
      'p-button-link': this.link,
      [`p-button-${ this.severity }`]: this.severity,
      'p-button-raised': this.raised,
      'p-button-rounded': this.rounded,
      'p-button-text': this.text,
      'p-button-outlined': this.outlined,
      'p-button-sm': this.size === 'small',
      'p-button-lg': this.size === 'large',
      'p-button-plain': this.plain,
      [`${ this.styleClass }`]: this.styleClass
    };
  }

  spinnerIconClass(): string {
    return Object.entries(this.iconClass())
      .filter(([, value]) => !!value)
      .reduce((acc, [key]) => acc + ` ${ key }`, 'p-button-loading-icon');
  }

  iconClass() {
    return {
      'p-button-icon': true,
      'p-button-icon-left': this.iconPos === 'left' && this.label,
      'p-button-icon-right': this.iconPos === 'right' && this.label,
      'p-button-icon-top': this.iconPos === 'top' && this.label,
      'p-button-icon-bottom': this.iconPos === 'bottom' && this.label
    };
  }

  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch(item.getType()) {
        case 'content':
          this.contentTemplate = item.template;
          break;

        case 'icon':
          this.iconTemplate = item.template;
          break;

        case 'loadingicon':
          this.loadingIconTemplate = item.template;
          break;

        default:
          this.contentTemplate = item.template;
          break;
      }
    });
  }

  badgeStyleClass() {
    return {
      'p-badge p-component': true,
      'p-badge-no-gutter': this.badge && String(this.badge).length === 1
    };
  }
}
