<?php

namespace App\Enums;

enum TransferStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending_approval';
    case Approved = 'approved';
    case Shipped = 'processing';
    case Received = 'complete';
    case Cancelled = 'cancelled';
}
