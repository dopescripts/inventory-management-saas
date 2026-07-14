<?php

namespace Tests\Feature;

use App\Services\Inventory\TransferWorkflowService;
use Tests\TestCase;

class TransferWorkflowTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_transfer_workflow_service_can_be_instantiated(): void
    {
        $service = app(TransferWorkflowService::class);
        $this->assertInstanceOf(TransferWorkflowService::class, $service);
    }
}
