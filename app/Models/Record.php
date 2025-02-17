<?php

namespace App\Models;

use App\Enums\RecordType;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Record extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'user_id',
        'source_account_id',
        'destination_account_id',
        'category_id',
        'sub_category_id',
        'type',
        'ignored',
        'amount',
        'description',
    ];

    protected $casts = [
        'type' => RecordType::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sourceAccount()
    {
        return $this->belongsTo(Account::class, 'source_account_id');
    }

    public function destinationAccount()
    {
        return $this->belongsTo(Account::class, 'destination_account_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
}
