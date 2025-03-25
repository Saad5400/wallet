<?php

namespace App\Models;

use App\Tenancy\Traits\HasTenants;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable, HasTenants;

    protected $fillable = [
        'name',
        'password',
        'email',
    ];

    protected $hidden = [
        'remember_token',
    ];

    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }
}
