<?php

namespace App\Http\Controllers;

use App\Http\Requests\Welcome\RequestOtpRequest;
use App\Http\Requests\Welcome\SaveProfileRequest;
use App\Http\Requests\Welcome\ValidateOtpRequest;
use App\Jobs\SendEmailJob;
use App\Mail\OtpEmail;
use App\Models\User;
use Auth;
use Inertia\Inertia;
use Otp;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome/Welcome');
    }

    public function email()
    {
        $email = session('email') ?? '';
        return Inertia::render('Welcome/EnterEmail', compact('email'));
    }

    public function requestOtp(RequestOtpRequest $request)
    {
        $data = $request->validated();
        $email = $data['email'];

        $otp = Otp::generate($email);
        dispatch(new SendEmailJob($email, new OtpEmail($otp)));
        session()->put('email', $email);

        return redirect()->route('welcome.enterOtp');
    }

    public function enterOtp()
    {
        $email = session('email');

        if (!$email)
            return redirect()->route('welcome.enterEmail');

        return Inertia::render('Welcome/EnterOtp', compact('email'));
    }

    public function validateOtp(ValidateOtpRequest $request)
    {
        $data = $request->validated();
        $email = session('email');
        $otp = $data['otp'];

        if (!Otp::validate($email, $otp)->status)
            return redirect()->route('welcome.enterOtp')->withErrors(['otp' => 'رمز التحقق المدخل غير صحيح']);

        session()->forget('email');

        $user = User::query()->firstOrCreate(['email' => $email]);

        Auth::login($user);

        if ($user->wasRecentlyCreated)
            return redirect()->route('welcome.completeProfile');

        return redirect()->route('dashboard');
    }

    public function completeProfile()
    {
        if (Auth::user()->name)
            return redirect()->route('dashboard');

        return Inertia::render('Welcome/CompleteProfile');
    }

    public function saveProfile(SaveProfileRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        $user->update($data);

        return redirect()->route('dashboard');
    }
}
