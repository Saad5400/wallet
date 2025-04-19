import React from 'react';
import { Record } from '@/types';
import RecordItem from './RecordItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LatestRecordsProps {
  records: Array<Record & {
    account: { name: string };
    category?: { name: string };
    subCategory?: { name: string };
  }>;
}

export default function LatestRecords({ records }: LatestRecordsProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardDescription>
          أحدث العمليات
        </CardDescription>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">
            لا توجد عمليات حتى الآن
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardDescription>
        أحدث العمليات
      </CardDescription>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {records.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}