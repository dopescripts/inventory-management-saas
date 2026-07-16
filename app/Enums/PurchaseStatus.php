<?php

namespace App\Enums;

enum PurchaseStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending_approval';
    case Approved = 'approved';
    case PartiallyReceived = 'partially_received';
    case Received = 'received';
    case Closed = 'closed';
    case Cancelled = 'cancelled';
}
