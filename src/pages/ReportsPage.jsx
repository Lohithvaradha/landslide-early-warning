import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  CheckCircle2,
  Filter,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';

export function ReportsPage() {
  const { reports, addReport, locations } = useDisaster();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tension Ground Cracks');
  const [locationName, setLocationName] = useState('Eagle Ridge Pass - North Flank');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Table search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReportForModal, setSelectedReportForModal] = useState(null);

  // Handle image upload simulation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulated GPS auto-detect
  const handleAutoGPS = () => {
    setLocationName('GPS: 30.3215° N, 78.0412° E (Eagle Ridge Sector)');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addReport({
        title,
        category,
        location: locationName,
        severity,
        description,
        citizen_name: citizenName || 'Anonymous Citizen',
        phone_masked: phone ? `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}` : '+91 98****0012',
        image_preview: imagePreview || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        coordinates: [30.32 + Math.random() * 0.04, 78.03 + Math.random() * 0.05],
      });

      setIsSubmitting(false);
      setSuccessMsg('Incident report dispatched to District Emergency Operations Center!');

      // Reset form
      setTitle('');
      setDescription('');
      setImagePreview(null);

      setTimeout(() => setSuccessMsg(''), 4500);
    }, 400);
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <FileSpreadsheet className="text-rose-400" size={24} />
          Crowdsourced Citizen Incident Reporting
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Empowering mountain communities to report early geological warning signs: cracks, slope bulging, and spring seepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report Submission Form */}
        <div className="lg:col-span-5 bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Camera size={16} className="text-cyan-400" />
                Submit Incident Report
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Civic Sentinel
              </span>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Incident Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fresh 3-inch fissures opening along ridge road"
                className="w-full bg-command-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* Category and Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phenomenon Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-command-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="Tension Ground Cracks">Tension Ground Cracks</option>
                  <option value="Spring Seepage / Liquefaction">Spring Seepage / Muddy Water</option>
                  <option value="Structural Deformation">Retaining Wall Tilt / Bulge</option>
                  <option value="Rockfall / Vegetative Tilt">Rockfall / Leaning Trees</option>
                  <option value="Debris Flow Accumulation">Debris Flow / Mud Accumulation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-command-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
                >
                  <option value="Low">Low - Minor Observation</option>
                  <option value="Moderate">Moderate - Noticeable Shift</option>
                  <option value="High">High - Impending Danger</option>
                  <option value="Critical">Critical - Immediate Hazard</option>
                </select>
              </div>
            </div>

            {/* Location with Auto GPS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Location / Landmarks *
                </label>
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <MapPin size={12} /> Auto-Detect GPS
                </button>
              </div>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Village / road milestone / coordinates"
                className="w-full bg-command-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* Image Upload UI Placeholder with Drag & Preview */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Photographic Evidence
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-3 bg-command-950/60 text-center transition-colors">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-semibold shadow"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-2">
                    <UploadCloud className="mx-auto text-slate-500 mb-1" size={24} />
                    <span className="text-xs text-slate-300 font-semibold block">
                      Click to upload photo or drag & drop
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      JPG, PNG, WEBP (Max 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Observation *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe size of cracks, presence of water sounds, leaning poles, or movement rate..."
                className="w-full bg-command-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 placeholder:text-slate-600 font-medium resize-none"
              />
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Reporter Name</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-command-950 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="For authority verification"
                  className="w-full bg-command-950 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Transmitting Encrypted Report...</span>
              ) : (
                <>
                  <CheckCircle size={15} />
                  <span>Transmit Field Observation to DEOC</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Reports Table with Status & Search */}
        <div className="lg:col-span-7 bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-amber-400" />
                  Community Incident Registry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified ground reports feed straight into hazard probability maps
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-command-950 p-1 rounded-xl border border-slate-800">
                {['All', 'Pending Review', 'Verified'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      statusFilter === st
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports by location, crack type, or title..."
                className="w-full bg-command-950 border border-slate-800 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-slate-600 placeholder:text-slate-600"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2 px-2.5">ID</th>
                    <th className="py-2 px-2.5">Incident</th>
                    <th className="py-2 px-2.5">Severity</th>
                    <th className="py-2 px-2.5">Location</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredReports.map((rep) => (
                    <tr
                      key={rep.id}
                      className="hover:bg-command-800/40 transition-colors group"
                    >
                      <td className="py-2.5 px-2.5 font-mono text-cyan-400 font-bold whitespace-nowrap">
                        {rep.id}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="font-semibold text-white line-clamp-1">{rep.title}</div>
                        <div className="text-[10px] text-slate-400">{rep.category} • {rep.timestamp}</div>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <RiskBadge level={rep.severity} size="sm" />
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-300 max-w-[140px] truncate">
                        {rep.location}
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            rep.status === 'Verified'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : rep.status === 'Pending Review'
                              ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedReportForModal(rep)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
                          title="View Full Report"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Showing {filteredReports.length} crowd-sourced submissions</span>
            <span className="text-cyan-400">All submissions geo-tagged</span>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      <Modal
        isOpen={!!selectedReportForModal}
        onClose={() => setSelectedReportForModal(null)}
        title={selectedReportForModal?.title || 'Report Inspection'}
      >
        {selectedReportForModal && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <RiskBadge level={selectedReportForModal.severity} size="md" />
              <span className="font-mono text-slate-400">{selectedReportForModal.timestamp}</span>
            </div>

            {selectedReportForModal.image_preview && (
              <div className="rounded-xl overflow-hidden border border-slate-700 max-h-56">
                <img
                  src={selectedReportForModal.image_preview}
                  alt="Incident photograph"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 p-3 bg-command-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold text-white">{selectedReportForModal.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Classification</span>
                <span className="font-semibold text-amber-400">{selectedReportForModal.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Submitted By</span>
                <span className="font-semibold text-slate-200">{selectedReportForModal.citizen_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Contact</span>
                <span className="font-mono text-slate-300">{selectedReportForModal.phone_masked}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] mb-1">Field Narrative</span>
              <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {selectedReportForModal.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
