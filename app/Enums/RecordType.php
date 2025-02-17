<?php

namespace App\Enums;

enum RecordType: string
{
    case income = 'income';
    case expense = 'expense';
    case transfer = 'transfer';
}
