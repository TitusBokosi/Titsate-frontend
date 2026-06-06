STRUCTURE

    src/
    ├── features/                                  # BUSINESS FEATURES (domain-driven)
    │                                              # Each feature is self-contained.
    │                                              # Do NOT import across features directly.
    │
    │   ├── auth/                                  # Authentication & identity access
    │   │   ├── api/
    │   │   │   └── auth.api.js                    # HTTP calls only (login, signup, OTP, refresh)
    │   │   │                                      # No React logic here
    │   │   ├── components/
    │   │   │   ├── LoginForm.jsx                  # Dumb UI components (no routing)
    │   │   │   ├── SignupForm.jsx
    │   │   │   └── OtpForm.jsx
    │   │   │   └── ForgotPasswordForm.jsx
    │   │   ├── hooks/
    │   │   │   └── useAuth.js                     # Feature-specific auth logic
    │   │   │                                      # Uses auth.api.js internally
    │   │   ├── pages/
    │   │   │   ├── LoginPage.jsx                  # Route-level component
    │   │   │   ├── SignupPage.jsx
    │   │   │   └── OtpVerificationPage.jsx
    │   │   │                                       # Pages wire UI + hooks together
    │   │   └── index.js                            # Barrel exports (optional)
    │
    │   ├── identity/                               # NRB / National ID verification
    │   │   ├── api/
    │   │   │   └── identity.api.js                 # Calls NRB verification endpoints
    │   │   ├── components/
    │   │   │   └── NationalIdForm.jsx              # UI for National ID input
    │   │   ├── hooks/
    │   │   │   └── useIdentityVerification.js      # Verification workflow logic
    │   │   ├── pages/
    │   │   │   └── IdentityVerificationPage.jsx    # Page shown during ID verification
    │   │   └── index.js
    │
    │   ├── passport/                              # Passport application lifecycle
    │   │   ├── api/
    │   │   │   └── passport.api.js                # Submit/update/fetch application status
    │   │   ├── components/
    │   │   │   ├── PassportTypeStep.jsx           # Step 1: passport type
    │   │   │   ├── PersonalInfoStep.jsx           # Step 2: personal details
    │   │   │   ├── ReviewStep.jsx                 # Step 3: review & confirm
    │   │   │   └── ProgressIndicator.jsx          # Multi-step progress UI
    │   │   ├── hooks/
    │   │   │   └── usePassportApplication.js       # Manages multi-step state
    │   │   ├── pages/
    │   │   │   └── PassportApplicationPage.jsx     # Owns the entire flow
    │   │   └── index.js
    │
    │   ├── payments/                              # Payment handling
    │   │   ├── api/
    │   │   │   └── payments.api.js                # Initiate & verify payments
    │   │   ├── components/
    │   │   │   ├── PaymentOptions.jsx             # Payment method selection
    │   │   │   └── PaymentSummary.jsx             # Amount & confirmation
    │   │   ├── hooks/
    │   │   │   └── usePayments.js                 # Payment flow logic
    │   │   ├── pages/
    │   │   │   └── PaymentPage.jsx
    │   │   └── index.js
    │
    │   ├── notifications/                         # System/user notifications
    │   │   ├── api/
    │   │   │   └── notifications.api.js           # Fetch & mark notifications
    │   │   ├── components/
    │   │   │   └── NotificationList.jsx
    │   │   ├── hooks/
    │   │   │   └── useNotifications.js
    │   │   ├── pages/
    │   │   │   └── NotificationsPage.jsx
    │   │   └── index.js
    │
    │   ├── dashboard/                             # User overview & status
    │   │   ├── api/
    │   │   │   └── dashboard.api.js               # Aggregated dashboard data
    │   │   ├── components/
    │   │   │   ├── StatusCard.jsx                 # Application/payment status
    │   │   │   └── QuickActions.jsx               # Shortcuts (apply, pay, track)
    │   │   ├── hooks/
    │   │   │   └── useDashboard.js
    │   │   ├── pages/
    │   │   │   └── DashboardPage.jsx
    │   │   └── index.js
    │
    ├── layouts/                              # PAGE LAYOUTS
    │   ├── AppLayout.jsx                     # NAV + FOOTER
    │   └── BareLayout.jsx                    # NO NAV / NO FOOTER
    │
    ├── providers/                            # GLOBAL CONTEXT PROVIDERS
    │   ├── AuthProvider.jsx                  # Owns user, token, login/logout
    │   │                                     # Single source of auth truth
    │   ├── QueryClientProvider.jsx           # React Query setup
    │   └── AppProviders.jsx                  # Combines ALL providers
    │                                         # Only imported in main.jsx
    │
    ├── lib/                                  # INFRASTRUCTURE (framework-level)
    │   ├── axios.js                          # Axios instance + interceptors
    │   │                                     # Token injection & refresh
    │   ├── queryClient.js                    # React Query configuration
    │   └── storage.js                        # local/session storage helpers
    │
    ├── routes/                               # ROUTING & ACCESS CONTROL
    │   ├── index.jsx                         # Application route definitions
    │   ├── PrivateRoute.jsx                  # Auth-protected routes
    │   │                                     # Redirects unauth users
    │   └── RoleRoute.jsx                     # Role-based protection
    │                                         # Citizen / Officer / Admin
    │
    ├── components/                           # SHARED UI (cross-feature)
    │   ├── Navbar.jsx                        # App navigation
    │   ├── Footer.jsx
    │   ├── Loader.jsx                        # Global loading indicator
    │   └── ErrorMessage.jsx                  # Reusable error display
    │
    ├── hooks/                                # GLOBAL reusable hooks
    │   ├── useAuth.js                        # Read AuthProvider state
    │   └── useOnlineStatus.js                # Connectivity awareness
    │
    ├── utils/                                # PURE FUNCTIONS (no React)
    │   ├── helpers.js                        # Formatting, mapping
    │   ├── validators.js                     # Form validation helpers
    │   └── constants.js                      # App-wide constants
    │
    ├── App.jsx                               # App shell (mounts router)
    │                                         # NO business logic here
    └── main.jsx                              # Entry point
                                              # Wraps App with AppProviders
