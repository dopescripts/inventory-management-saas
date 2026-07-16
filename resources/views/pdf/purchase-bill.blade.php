<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bill #{{ $bill->bill_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #333; padding: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .header-left { max-width: 60%; }
        .header-right { text-align: right; }
        .company-name { font-size: 20px; font-weight: bold; color: #1a1a1a; margin-bottom: 5px; }
        .bill-title { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 20px; }
        .info-grid { display: table; width: 100%; margin-bottom: 30px; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; }
        .info-block { margin-bottom: 15px; }
        .info-label { font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 3px; }
        .info-value { font-size: 12px; color: #1a1a1a; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .status-draft { background: #f3f4f6; color: #6b7280; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-partially_paid { background: #dbeafe; color: #1e40af; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-cancelled { background: #f3f4f6; color: #6b7280; text-decoration: line-through; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; }
        table.items td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; }
        table.items tr:last-child td { border-bottom: none; }
        .text-right { text-align: right; }
        .totals { width: 300px; margin-left: auto; margin-top: 20px; }
        .totals table { width: 100%; }
        .totals td { padding: 6px 0; }
        .totals .total-row { font-size: 16px; font-weight: bold; border-top: 2px solid #1a1a1a; padding-top: 10px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
        .po-reference { color: #6b7280; font-size: 11px; }
    </style>
</head>
<body>
    <table style="width: 100%; margin-bottom: 30px;">
        <tr>
            <td style="vertical-align: top; width: 60%;">
                <div class="company-name">{{ $tenant->name }}</div>
                @if($tenant->billing_address)
                    <div style="color: #666; margin-top: 5px; white-space: pre-line;">{{ $tenant->billing_address }}</div>
                @endif
                @if($tenant->billing_phone)
                    <div style="color: #666;">{{ $tenant->billing_phone }}</div>
                @endif
                @if($tenant->billing_email)
                    <div style="color: #666;">{{ $tenant->billing_email }}</div>
                @endif
                @if($tenant->tax_id)
                    <div style="color: #666; margin-top: 5px;">Tax ID: {{ $tenant->tax_id }}</div>
                @endif
            </td>
            <td style="vertical-align: top; text-align: right;">
                <div class="bill-title">BILL</div>
                <div style="margin-bottom: 5px;"><strong>Bill #:</strong> {{ $bill->bill_number }}</div>
                <div style="margin-bottom: 5px;"><strong>Date:</strong> {{ $bill->issued_at?->format('M d, Y') ?? now()->format('M d, Y') }}</div>
                @if($bill->due_date)
                    <div style="margin-bottom: 5px;"><strong>Due:</strong> {{ $bill->due_date->format('M d, Y') }}</div>
                @endif
                <div style="margin-top: 8px;">
                    <span class="status-badge status-{{ $bill->status->value }}">{{ str_replace('_', ' ', $bill->status->value) }}</span>
                </div>
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin-bottom: 30px;">
        <tr>
            <td style="vertical-align: top; width: 50%;">
                <div class="info-label">Bill To (Vendor)</div>
                <div class="info-value">
                    <strong>{{ $vendor->name }}</strong><br>
                    @if($vendor->email){{ $vendor->email }}<br>@endif
                    @if($vendor->phone){{ $vendor->phone }}<br>@endif
                    @if($vendor->address){{ $vendor->address }}@endif
                </div>
            </td>
            <td style="vertical-align: top; text-align: right;">
                @if($bill->purchaseOrder)
                    <div class="info-label">PO Reference</div>
                    <div class="info-value po-reference">{{ $bill->purchaseOrder->purchase_number }}</div>
                @endif
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 35%;">Description</th>
                <th class="text-right" style="width: 12%;">Qty</th>
                <th class="text-right" style="width: 16%;">Unit Cost</th>
                <th class="text-right" style="width: 12%;">Discount</th>
                <th class="text-right" style="width: 10%;">Tax</th>
                <th class="text-right" style="width: 16%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bill->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->description ?? $item->item?->name ?? 'Item' }}</td>
                    <td class="text-right">{{ number_format($item->quantity, 2) }}</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($item->unit_cost, $currency->decimal_places) }}</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($item->discount, $currency->decimal_places) }}</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($item->tax, $currency->decimal_places) }}</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($item->total, $currency->decimal_places) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal</td>
                <td class="text-right">{{ $currency->symbol }}{{ number_format($bill->subtotal, $currency->decimal_places) }}</td>
            </tr>
            @if($bill->discount > 0)
                <tr>
                    <td>Discount</td>
                    <td class="text-right">-{{ $currency->symbol }}{{ number_format($bill->discount, $currency->decimal_places) }}</td>
                </tr>
            @endif
            @if($bill->tax > 0)
                <tr>
                    <td>Tax</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($bill->tax, $currency->decimal_places) }}</td>
                </tr>
            @endif
            <tr class="total-row">
                <td>Total</td>
                <td class="text-right">{{ $currency->symbol }}{{ number_format($bill->total, $currency->decimal_places) }}</td>
            </tr>
            @if($bill->paid_amount > 0)
                <tr>
                    <td>Paid</td>
                    <td class="text-right">{{ $currency->symbol }}{{ number_format($bill->paid_amount, $currency->decimal_places) }}</td>
                </tr>
                <tr>
                    <td><strong>Balance Due</strong></td>
                    <td class="text-right"><strong>{{ $currency->symbol }}{{ number_format($bill->total - $bill->paid_amount, $currency->decimal_places) }}</strong></td>
                </tr>
            @endif
        </table>
    </div>

    @if($bill->notes)
        <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 5px;">
            <div class="info-label">Notes</div>
            <div style="margin-top: 5px; white-space: pre-line;">{{ $bill->notes }}</div>
        </div>
    @endif

    <div class="footer">
        <p>Generated by {{ $tenant->name }} &mdash; {{ now()->format('M d, Y \a\t h:i A') }}</p>
    </div>
</body>
</html>
