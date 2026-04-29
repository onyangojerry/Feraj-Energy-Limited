import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Battery,
  Bolt,
  Calendar,
  MapPin,
  Thermometer,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  getLatestTelemetry,
  getMyDevices,
  requestDeviceRegistration,
  updateDevice,
  type Device,
  type TelemetryPoint,
} from '@/services/device.service';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [telemetry, setTelemetry] = useState<Record<string, TelemetryPoint>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    serial_number: '',
    qr_code: '',
    location: '',
    installation_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [locationDraft, setLocationDraft] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchDevices = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getMyDevices(user.id);
        if (!cancelled) {
          setDevices(data);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load devices');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDevices();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const fetchTelemetry = async () => {
      const ids = devices.map((device) => device.id);
      if (!ids.length) {
        if (!cancelled) {
          setTelemetry({});
        }
        return;
      }
      try {
        const latest = await getLatestTelemetry(ids);
        const map = latest.reduce<Record<string, TelemetryPoint>>(
          (acc, point) => {
            acc[point.device_id] = point;
            return acc;
          },
          {}
        );
        if (!cancelled) {
          setTelemetry(map);
        }
      } catch (error: any) {
        if (!cancelled) {
          console.error('Telemetry fetch failed', error);
        }
      }
    };

    fetchTelemetry();

    return () => {
      cancelled = true;
    };
  }, [devices]);

  useEffect(() => {
    if (!devices.length) return;
    const channel = supabase
      .channel('device-telemetry-stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'device_telemetry' },
        (payload) => {
          const point = payload.new as TelemetryPoint;
          if (!devices.find((device) => device.id === point.device_id)) {
            return;
          }
          setTelemetry((prev) => ({
            ...prev,
            [point.device_id]: point,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [devices]);

  const metrics = useMemo(() => {
    if (!devices.length) return null;
    const totals = devices.reduce(
      (acc, device) => {
        const point = telemetry[device.id];
        if (!point) return acc;
        acc.power_output += point.power_output || 0;
        acc.energy_generated += point.energy_generated || 0;
        acc.faults += point.fault_code ? 1 : 0;
        return acc;
      },
      { power_output: 0, energy_generated: 0, faults: 0 }
    );

    return totals;
  }, [devices, telemetry]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await requestDeviceRegistration({
        serial_number: form.serial_number.trim(),
        method: 'self',
        requested_by: user.id,
        metadata: {
          qr_code: form.qr_code.trim(),
          location: form.location.trim(),
          installation_date: form.installation_date || null,
        },
      });
      toast.success('Device registration submitted for approval.');
      setForm({
        serial_number: '',
        qr_code: '',
        location: '',
        installation_date: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to register device');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSave = async (device: Device) => {
    try {
      await updateDevice(device.id, { location: locationDraft });
      setDevices((prev) =>
        prev.map((item) =>
          item.id === device.id ? { ...item, location: locationDraft } : item
        )
      );
      setEditingId(null);
      toast.success('Device updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update device');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-[var(--section-max-width)] space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 rounded bg-white/10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="cinematic-panel p-6 animate-pulse space-y-4"
              >
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="h-4 w-44 rounded bg-white/10" />
                <div className="h-12 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="mx-auto max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,14,20,0.95),rgba(9,11,16,0.84))] p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.16),transparent_35%),radial-gradient(circle_at_84%_78%,rgba(49,209,122,0.14),transparent_42%)]" />
          <div className="relative">
            <p className="cinematic-eyebrow">Account Chapter • Devices</p>
            <h1 className="mt-3 text-4xl font-semibold text-white/90 sm:text-5xl">
              My Devices
            </h1>
            <p className="mt-3 text-white/60">
              Monitor live energy output, device health, and installation
              details.
            </p>
          </div>
        </section>

        {metrics && (
          <div className="mb-10 mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="cinematic-panel p-6">
              <div className="mb-2 flex items-center gap-3 text-white/70">
                <Bolt className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Live Output</span>
              </div>
              <div className="text-2xl font-semibold text-white/90">
                {metrics.power_output.toFixed(1)} kW
              </div>
            </div>
            <div className="cinematic-panel p-6">
              <div className="mb-2 flex items-center gap-3 text-white/70">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Energy Generated</span>
              </div>
              <div className="text-2xl font-semibold text-white/90">
                {metrics.energy_generated.toFixed(1)} kWh
              </div>
            </div>
            <div className="cinematic-panel p-6">
              <div className="mb-2 flex items-center gap-3 text-white/70">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Active Alerts</span>
              </div>
              <div className="text-2xl font-semibold text-white/90">
                {metrics.faults}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {devices.length === 0 && (
              <div className="cinematic-panel p-6">
                <h2 className="mb-2 text-xl font-semibold text-white/90">
                  No registered devices yet
                </h2>
                <p className="text-white/60">
                  Register your device to start monitoring energy production.
                </p>
              </div>
            )}

            {devices.map((device, index) => {
              const point = telemetry[device.id];
              const status = point?.status || device.status;
              const alert =
                point?.fault_code ||
                (status && status !== 'active' && status !== 'online');

              return (
                <motion.article
                  key={device.id}
                  className="cinematic-panel space-y-4 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white/90">
                        {device.device_type} • {device.serial_number}
                      </h3>
                      <p className="text-sm text-white/55">
                        Last seen{' '}
                        {device.last_seen_at
                          ? new Date(device.last_seen_at).toLocaleString()
                          : '—'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        alert
                          ? 'border border-red-500/30 bg-red-500/10 text-red-300'
                          : 'border border-primary/30 bg-primary/10 text-primary'
                      }`}
                    >
                      {alert ? 'Attention Required' : 'Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/45">Power</p>
                      <p className="text-lg font-semibold text-white/90">
                        {point?.power_output?.toFixed(1) || '—'} kW
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/45">Voltage</p>
                      <p className="text-lg font-semibold text-white/90">
                        {point?.voltage?.toFixed(1) || '—'} V
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/45">Battery</p>
                      <p className="flex items-center gap-2 text-lg font-semibold text-white/90">
                        <Battery className="h-4 w-4 text-primary" />
                        {point?.battery_level?.toFixed(0) || '—'}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/45">Temperature</p>
                      <p className="flex items-center gap-2 text-lg font-semibold text-white/90">
                        <Thermometer className="h-4 w-4 text-primary" />
                        {point?.temperature?.toFixed(1) || '—'}°C
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm text-white/60 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {device.location || 'No location set'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {device.installation_date || 'No installation date'}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    {editingId === device.id ? (
                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          value={locationDraft}
                          onChange={(e) => setLocationDraft(e.target.value)}
                          className="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/85 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35"
                          placeholder="Update device location"
                        />
                        <button
                          type="button"
                          onClick={() => handleLocationSave(device)}
                          className="rounded-md border border-primary/35 bg-primary/90 px-4 py-2 text-primary-foreground transition hover:bg-primary"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-md btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(device.id);
                          setLocationDraft(device.location || '');
                        }}
                        className="text-sm font-semibold text-primary transition hover:text-primary/85"
                      >
                        Update device info
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="cinematic-panel-strong h-fit p-6 lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-semibold text-white/90">
              Register a Device
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Serial Number
                </label>
                <input
                  value={form.serial_number}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serial_number: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/85 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35"
                  placeholder="SN-0001-XYZ"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  QR Code (Optional)
                </label>
                <input
                  value={form.qr_code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      qr_code: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/85 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35"
                  placeholder="QR-001-ABC"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Installation Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/85 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35"
                  placeholder="Nairobi, Kenya"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Installation Date
                </label>
                <input
                  type="date"
                  value={form.installation_date}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      installation_date: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/85 focus:ring-2 focus:ring-primary/35"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md border border-primary/35 bg-primary/90 px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
