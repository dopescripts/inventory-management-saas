<?php

namespace App\Enums;


enum TransferStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Shipped = 'shipped';
    case Received = 'received';
    case Cancelled = 'cancelled';
}
