import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public allExpanded: boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public toggleSubList(event: Event): void {
    event.preventDefault();
    const link = event.currentTarget as HTMLElement;
    const subList = link.nextElementSibling as HTMLElement;
    const iconContainer = link.querySelector('.toggle-icon') as HTMLElement;
    const isExpanded = link.getAttribute('aria-expanded') === 'true';

    if (subList) {
        if (isExpanded) {
            subList.classList.add('d-none');
            link.setAttribute('aria-expanded', 'false');
            link.classList.remove('expanded');
            if (iconContainer) iconContainer.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            subList.classList.remove('d-none');
            link.setAttribute('aria-expanded', 'true');
            link.classList.add('expanded');
            if (iconContainer) iconContainer.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    }
  }

  public expandAll(event: Event): void {
    event.preventDefault();
    const button = event.currentTarget as HTMLElement;
    const categoryItems = document.querySelectorAll('#categories .category-item'); // Cible les conteneurs

    this.allExpanded = !this.allExpanded;

    categoryItems.forEach(item => {
        const link = item.querySelector('a') as HTMLElement;
        const subList = item.querySelector('.sub-list') as HTMLElement;
        const iconContainer = link.querySelector('.toggle-icon') as HTMLElement;

        if (link && subList) { // Vérifier si link et subList existent
            const isCurrentlyExpanded = link.getAttribute('aria-expanded') === 'true';

            if (this.allExpanded) {
                if (!isCurrentlyExpanded) {
                    subList.classList.remove('d-none');
                    link.setAttribute('aria-expanded', 'true');
                    link.classList.add('expanded');
                    if (iconContainer) iconContainer.innerHTML = '<i class="fas fa-chevron-down"></i>';
                }
            } else {
                if (isCurrentlyExpanded) {
                    subList.classList.add('d-none');
                    link.setAttribute('aria-expanded', 'false');
                    link.classList.remove('expanded');
                    if (iconContainer) iconContainer.innerHTML = '<i class="fas fa-chevron-right"></i>';
                }
            }
        }
    });

    if (button) { // Vérifier si button existe
        if (this.allExpanded) {
            button.innerHTML = '<i class="fas fa-chevron-up me-1"></i>Tout réduire';
        } else {
            button.innerHTML = '<i class="fas fa-chevron-down me-1"></i>Tout déplier';
        }
    }
  }

  goToCourses() {
  this.router.navigate(['/ues']);
  }
}
