import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ClipboardCopy,
  Cloud,
  FileUp,
  Power,
  XCircle,
} from 'lucide-react';
import {
  approveDeviceRegistration,
  bulkProvisionInventory,
  getAllDevices,
  getDeviceRegistrations,
  rejectDeviceRegistration,
  updateDevice,
  type Device,
  type DeviceRegistration,
} from '@/services/device.service';
import { toast } from 'sonner';

export function AdminDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [registrations, setRegistrations] = useState<DeviceRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuingKey, setIssuingKey] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesData, registrationsData] = await Promise.all([
          getAllDevices(),
          getDeviceRegistrations(),
        ]);
        setDevices(devicesData);
        setRegistrations(registrationsData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRegistrations = useMemo(
    () => registrations.filter((reg) => reg.status === 'pending'),
    [registrations]
  );

  const handleApprove = async (id: string) => {
    try {
      const apiKey = await approveDeviceRegistration(id);
      setIssuingKey(apiKey);
      toast.success('Device approved');
      const updated = await getDeviceRegistrations();
      const updatedDevices = await getAllDevices();
      setRegistrations(updated);
      setDevices(updatedDevices);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDeviceRegistration(id, 'Rejected by admin');
      toast.success('Registration rejected');
      setRegistrations(await getDeviceRegistrations());
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  const handleStatusToggle = async (device: Device) => {
    const nextStatus = device.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await updateDevice(device.id, { status: nextStatus });
      setDevices((prev) =>
        prev.map((item) => (item.id === device.id ? updated : item))
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to update device');
    }
  };

  const handleBulkUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setBulkLoading(true);
      const text = await file.text();
      const rows = text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const header = rows[0].toLowerCase();
      const hasHeader = header.includes('serial_number');
      const dataRows = hasHeader ? rows.slice(1) : rows;

      const payload = dataRows.map((line) => {
        const [serial_number, mac_address, qr_code, device_type] = line
          .split(',')
          .map((value) => value.trim());

        return {
          serial_number,
          mac_address: mac_address || undefined,
          qr_code: qr_code || undefined,
          device_type,
        };
      });

      await bulkProvisionInventory(payload);
      toast.success('Inventory updated');
    } catch (error: any) {
      toast.error(error.message || 'Bulk upload failed');
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 animate-pulse rounded bg-white/8" />
        <div className="h-32 animate-pulse rounded bg-white/8" />
      </div>
    );
  }

  return (
    <div className="space-y-10 text-white/86">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="cinematic-panel flex-1 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white/92">
            Pending Registrations
          </h2>
          {pendingRegistrations.length === 0 ? (
            <p className="text-white/60">No pending registrations right now.</p>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-white/50">Serial</p>
                    <p className="text-lg font-semibold text-white/92">
                      {reg.serial_number}
                    </p>
                    <p className="text-sm text-white/55">
                      Method: {reg.method}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(reg.id)}
                      className="rounded-md bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary/90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(reg.id)}
                      className="rounded-md border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cinematic-panel w-full p-6 lg:w-80">
          <h2 className="mb-4 text-xl font-semibold text-white/92">
            Bulk Provision
          </h2>
          <p className="mb-4 text-sm text-white/60">
            Upload CSV with columns: serial_number, mac_address, qr_code,
            device_type
          </p>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/6">
            <FileUp className="h-4 w-4" />
            <span>{bulkLoading ? 'Uploading...' : 'Upload CSV'}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleBulkUpload(e.target.files?.[0] || null)}
              disabled={bulkLoading}
            />
          </label>
        </div>
      </div>

      <div className="cinematic-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/92">
            Registered Devices
          </h2>
          <span className="text-sm text-white/55">
            {devices.length} devices
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8">
            <thead className="bg-white/4">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white/45">
                  Serial
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white/45">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white/45">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white/45">
                  Last Seen
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-white/45">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-white/86">
                    {device.serial_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/72">
                    {device.device_type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        device.status === 'active'
                          ? 'border border-primary/20 bg-white/6 text-primary'
                          : 'border border-red-500/20 bg-red-500/10 text-red-200'
                      }`}
                    >
                      <Cloud className="h-3 w-3" />
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/58">
                    {device.last_seen_at
                      ? new Date(device.last_seen_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleStatusToggle(device)}
                      className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
                    >
                      <Power className="h-4 w-4" />
                      {device.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {issuingKey && (
        <div className="cinematic-panel border border-primary/20 p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white/92">
              Device API Key Issued
            </h3>
          </div>
          <p className="mb-4 text-sm text-white/60">
            Copy and store this key now. It won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-3">
            <code className="break-all rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/86">
              {issuingKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(issuingKey);
                toast.success('API key copied');
              }}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={() => setIssuingKey(null)}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
            >
              <XCircle className="h-4 w-4" />
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
