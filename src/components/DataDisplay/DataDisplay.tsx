// Update the DataDisplay component to include onDelete prop
interface DataDisplayProps {
  // ... existing props ...
  onDelete: (id: string) => void;
}

export function DataDisplay({
  // ... existing props ...
  onDelete,
}: DataDisplayProps) {
  // ... existing code ...

  return (
    <div className="space-y-4">
      {/* ... existing code ... */}
      {activeTab === 'driver' ? (
        <DriverSalaryTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <VendorRentTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={onSort}
        />
      )}
    </div>
  );
}