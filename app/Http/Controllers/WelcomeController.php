<?php

namespace App\Http\Controllers;

use App\Http\Requests\Welcome\RequestOtpRequest;
use App\Http\Requests\Welcome\SaveProfileRequest;
use App\Http\Requests\Welcome\ValidateOtpRequest;
use App\Jobs\SendEmailJob;
use App\Mail\OtpEmail;
use App\Models\Tenant;
use App\Models\User;
use Auth;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;
use Otp;
use RateLimiter;

/**
 * Class WelcomeController
 *
 * This controller handles the user onboarding process including:
 * - Displaying the welcome page.
 * - Handling OTP (One-Time Password) generation, delivery, and validation.
 * - Completing and saving user profiles.
 *
 * @package App\Http\Controllers
 */
class WelcomeController extends Controller
{
    /**
     * Redirect the user to the appropriate page.
     *
     * If the user is authenticated, they are redirected to the home page.
     * Otherwise, they are redirected to the welcome page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function root()
    {
        return homeRedirect();
    }

    /**
     * Display the welcome page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Render the welcome page using Inertia.js.
        return Inertia::render('Welcome/Welcome');
    }

    /**
     * Display the email input page.
     *
     * Retrieves the email from the session (if it exists) to pre-fill the form.
     *
     * @return \Inertia\Response
     */
    public function email()
    {
        // Retrieve the email from the session; default to an empty string if not set.
        $email = session('email') ?? '';
        // Render the email entry page with the retrieved email.
        return Inertia::render('Welcome/EnterEmail', compact('email'));
    }

    /**
     * Handle OTP request and send it via email.
     *
     * This method:
     * - Validates the provided email.
     * - Uses rate limiting to prevent abuse.
     * - Generates an OTP.
     * - Dispatches a job to send the OTP via email.
     * - Stores the email in the session for subsequent verification.
     *
     * @param  \App\Http\Requests\Welcome\RequestOtpRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function requestOtp(RequestOtpRequest $request)
    {
        // Validate the incoming request data.
        $data = $request->validated();
        $email = $data['email'];

        // Identify the client by IP address for rate limiting.
        $ip = $request->ip();
        $key = "request-otp-{$ip}";

        // If too many OTP requests have been made from this IP, lock the user out.
        if (RateLimiter::tooManyAttempts($key, 5)) {
            // Fire a lockout event.
            event(new Lockout($request));
            // Determine how many seconds remain until the next allowed attempt.
            $seconds = RateLimiter::availableIn($key);
            // Redirect back to the email input page with an error message.
            return redirect()->route('welcome.enterEmail')->withErrors([
                'email' => "لقد قمت بإرسال الرمز مرات كثيرة، الرجاء المحاولة بعد {$seconds} ثانية"
            ]);
        }

        // Register this attempt and set a decay time of 5 minutes (300 seconds).
        RateLimiter::hit($key, 60 * 5);

        // Generate an OTP for the given email.
        $otp = Otp::generate($email);
        dispatch(new SendEmailJob($email, new OtpEmail($otp)));

        // Store the email in the session for later use during OTP validation.
        session()->put('email', $email);

        // Redirect the user to the OTP entry page.
        return redirect()->route('welcome.enterOtp');
    }

    /**
     * Display the OTP entry page.
     *
     * If no email is stored in the session, the user is redirected to the email input page.
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function enterOtp()
    {
        // Retrieve the email from the session.
        $email = session('email');

        // If no email is found in the session, redirect the user to the email input page.
        if (!$email) {
            return redirect()->route('welcome.enterEmail');
        }

        // Render the OTP entry page, passing the stored email.
        return Inertia::render('Welcome/EnterOtp', compact('email'));
    }

    /**
     * Validate the submitted OTP.
     *
     * This method:
     * - Validates the OTP against the one generated for the stored email.
     * - If invalid, redirects back to the OTP entry page with an error.
     * - If valid, removes the email from the session.
     * - Logs in the user (creating a new user if necessary).
     * - If the user is new, triggers the Registered event and redirects to the profile completion page.
     * - Otherwise, redirects the user to the dashboard.
     *
     * @param  \App\Http\Requests\Welcome\ValidateOtpRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function validateOtp(ValidateOtpRequest $request)
    {
        // Validate the OTP input.
        $data = $request->validated();
        // Retrieve the email from the session.
        $email = session('email');
        $otp = $data['otp'];

        // Validate the provided OTP for the email.
        if (!in_array(config('app.env'), ['local', 'testing']) && !Otp::validate($email, $otp)->status) {
            // If validation fails, redirect back with an error message.
            return redirect()->route('welcome.enterOtp')->withErrors([
                'otp' => 'رمز التحقق المدخل غير صحيح'
            ]);
        }

        // OTP is valid; remove the email from the session.
        session()->forget('email');

        // Find an existing user by email or create a new one.
        $user = User::query()->firstOrCreate(['email' => $email]);

        // Log the user in with "remember me" enabled.
        Auth::login($user, true);

        // If the user was just created, trigger the Registered event and redirect to profile completion.
        if ($user->wasRecentlyCreated) {
            event(new Registered($user));

            $tenant = Tenant::create([
                'name' => 'عائلتي',
            ]);

            $user->tenants()->attach($tenant->id);

            return redirect()->route('welcome.completeProfile');
        }

        // For existing users, redirect directly to the dashboard.
        return homeRedirect();
    }

    /**
     * Display the profile completion page.
     *
     * If the user's profile is already complete (i.e., name is set), they are redirected to the dashboard.
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function completeProfile()
    {
        // If the authenticated user already has a name, assume the profile is complete.
        $user = Auth::user();
        if ($user->name) {
            return homeRedirect();
        }

        // Render the profile completion page.
        return Inertia::render('Welcome/CompleteProfile');
    }

    /**
     * Save the user's completed profile.
     *
     * This method validates the submitted profile data, updates the user's information, 
     * and redirects them to the dashboard.
     *
     * @param  \App\Http\Requests\Welcome\SaveProfileRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveProfile(SaveProfileRequest $request)
    {
        // Validate the profile data.
        $data = $request->validated();
        // Get the authenticated user.
        $user = Auth::user();
        // Update the user's profile with the validated data.
        $user->update($data);

        // Redirect the user to the dashboard after successfully saving the profile.
        return homeRedirect($user);
    }
}
