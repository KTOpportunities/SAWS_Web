import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payfast-redirect',
  templateUrl: './payfast-redirect.component.html',
  styleUrls: ['./payfast-redirect.component.scss'],
})
export class PayfastRedirectComponent implements OnInit {
  title = 'Payment update';
  message = 'You can safely close this window and return to the app.';
  showBackToLogin = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // If PayFast adds query params, we don't need to do anything with them here.
    // This page exists purely to provide a stable, valid return/cancel URL.
    const path = this.route.snapshot.routeConfig?.path;

    if (path === 'subscription-successful') {
      this.title = 'Subscription created';
      this.message = 'Subscription created successfully. You can return to the app.';
      this.showBackToLogin = false;
    } else if (path === 'subscription-package') {
      this.title = 'Subscription cancelled';
      this.message = 'Payment was cancelled. You can return to the app.';
      this.showBackToLogin = true;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
