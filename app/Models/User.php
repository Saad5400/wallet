<?php

namespace App\Models;

use App\Tenancy\Traits\HasTenants;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Class User
 *
 * This model represents an application user.
 * It extends Laravel's Authenticatable class to provide authentication functionality,
 * and utilizes the Notifiable trait to enable notification features.
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use Notifiable, HasTenants;

    /**
     * The attributes that are mass assignable.
     *
     * These fields can be filled using methods like create() or update() with an array of attributes.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'password',
        'email',
    ];

    /**
     * The attributes that should be hidden for arrays and JSON serialization.
     *
     * This is used to prevent sensitive data from being exposed in API responses or when converting the model to an array.
     *
     * @var array<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
