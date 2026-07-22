<?php

namespace App\Http\Requests\Transfer;

use App\Models\Location;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create_transfers');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'source_warehouse_id' => [
                'required',
                Rule::exists('warehouses', 'id'),
            ],

            'source_location_id' => [
                'nullable',
                Rule::exists('locations', 'id'),
            ],

            'destination_warehouse_id' => [
                'required',
                Rule::exists('warehouses', 'id'),
            ],

            'destination_location_id' => [
                'nullable',
                Rule::exists('locations', 'id'),
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.item_id' => [
                'required',
                'distinct',
                Rule::exists('items', 'id'),
            ],

            'items.*.quantity_requested' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'items.*.remarks' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'items.*.item_id' => 'item',
            'items.*.quantity_requested' => 'quantity',
        ];
    }

    public function messages(): array
    {
        return [
            'destination_warehouse_id.different' => 'Source and destination warehouse cannot be the same.',

            'items.required' => 'Please add at least one item.',

            'items.*.item_id.distinct' => 'An item can only be added once.',

            'items.*.quantity_requested.gt' => 'Transfer quantity must be greater than zero.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('items')) {
            $this->merge([
                'items' => [],
            ]);
        }
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {

            $sameWarehouse =
                $this->source_warehouse_id == $this->destination_warehouse_id;

            $sameLocation =
                $this->source_location_id == $this->destination_location_id;

            /*
             |-------------------------------------------------------
             | Prevent identical source & destination
             |-------------------------------------------------------
             */

            if ($sameWarehouse && $sameLocation) {
                $validator->errors()->add(
                    'destination_location_id',
                    'Source and destination cannot be the same.'
                );
            }

            /*
             |-------------------------------------------------------
             | Validate source location belongs to warehouse
             |-------------------------------------------------------
             */

            if ($this->source_location_id) {

                $location = Location::find($this->source_location_id);

                if (
                    $location &&
                    $location->warehouse_id != $this->source_warehouse_id
                ) {
                    $validator->errors()->add(
                        'source_location_id',
                        'Selected source location does not belong to the selected warehouse.'
                    );
                }
            }

            /*
             |-------------------------------------------------------
             | Validate destination location belongs to warehouse
             |-------------------------------------------------------
             */

            if ($this->destination_location_id) {

                $location = Location::find($this->destination_location_id);

                if (
                    $location &&
                    $location->warehouse_id != $this->destination_warehouse_id
                ) {
                    $validator->errors()->add(
                        'destination_location_id',
                        'Selected destination location does not belong to the selected warehouse.'
                    );
                }
            }

        });
    }
}
