import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationComponent {
  @Input()
  categories: CategoryView[];

  openedCategories = [];

  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }

  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

  isOpened(category: Category): boolean {
    return this.openedCategories.includes(category.uniqueId);
  }

  toggleOpen(category: Category) {
    const index = this.openedCategories.findIndex(id => id === category.uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(category.uniqueId);
  }
}