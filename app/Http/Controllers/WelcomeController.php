<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestOtpRequest;
use App\Jobs\SendEmailJob;
use App\Mail\OtpEmail;
use Inertia\Inertia;
use Otp;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome/Page');
    }

    public function email()
    {
        return Inertia::render('Welcome/Email/Page');
    }

    public function requestOtp(RequestOtpRequest $request)
    {
        $data = $request->validated();
        $email = $data['email'];

        $otp = Otp::generate($email);
        dispatch(new SendEmailJob($email, new OtpEmail($otp)));

        return redirect()->route('welcome.emai.verify');
    }
}
