<?php

namespace App\Services;

use App\Models\CatalogItem;
use App\Models\PortfolioImage;
use App\Models\QueueEntry;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'total_catalog'        => CatalogItem::where('status', 1)->count(),
            'total_portfolio'      => PortfolioImage::where('status', 1)->count(),
            'total_queue_active'   => QueueEntry::where('status', 1)
                ->whereNotIn('queue_status', ['COMPLETED', 'CANCELLED'])
                ->count(),
            'queue_waiting'        => QueueEntry::where('status', 1)
                ->where('queue_status', 'WAITING')
                ->count(),
            'queue_in_progress'    => QueueEntry::where('status', 1)
                ->whereIn('queue_status', ['SKETCH', 'REVISION', 'RENDERING'])
                ->count(),
            'queue_completed'      => QueueEntry::where('status', 1)
                ->where('queue_status', 'COMPLETED')
                ->count(),
        ];
    }
}