<?php

namespace App\Enums;

enum InventoryMovementReferenceType: string
{
    case Adjustment = 'adjustment';
    case OpeningStock = 'opening_stock';
    case PurchaseReceive = 'purchase_receive';
    case PurchaseReturn = 'purchase_return';
    case Sale = 'sale';
    case SaleReturn = 'sale_return';
    case TransferIn = 'transfer_in';
    case TransferOut = 'transfer_out';
}
