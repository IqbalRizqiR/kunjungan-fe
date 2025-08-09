import React, { useState, useEffect } from 'react';
import { api } from '~/components/lib/api';


interface Visit {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    date: string;
    sessionId: string;
    institutionId: string;
    packageOption: string;
    specialRequest: string;
    visitors: string;
    status: string;
}

interface Session {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface PackageOption {
    value: string;
    name: string;
    price: number;
}

interface Institution {
    id: string;
    name: string;
    isPaid: boolean;
    price: number;
    packages: PackageOption[];
}

export default function AdminVisits() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    
    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const [visitors, setVisitors] = useState('1 person');
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [visitsRes, institutionsRes] = await Promise.all([
                    api.get('/visits'),
                    api.get('/institutions'),
                ]);
                setVisits(visitsRes.data);
                setInstitutions(institutionsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    // Fetch sessions when date changes
    useEffect(() => {
        if (!date) return;

        const fetchSessions = async () => {
            try {
                const res = await api.get('/visits/sessions', {
                    params: { date: new Date(date) },
                });
                setSessions(res.data);
            } catch (err) {
                console.error('Error fetching sessions:', err);
            }
        };

        fetchSessions();
    }, [date]);

    // Handler functions
    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const instId = e.target.value;
        const inst = institutions.find((i) => i.id === instId) || null;
        setSelectedInstitution(inst);
        setSelectedPackage('');
        setTotalCost(inst?.isPaid ? inst.price : 0);
    };

    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pkgValue = e.target.value;
        setSelectedPackage(pkgValue);
        const pkg = selectedInstitution?.packages.find((p) => p.value === pkgValue);
        setTotalCost(pkg?.price || 0);
    };

    // Handle form submit
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/visits/book', {
                firstName,
                lastName,
                phoneNumber,
                email,
                sessionId: selectedSessionId,
                institutionId: selectedInstitution?.id,
                packageOption: selectedPackage,
                specialRequest,
                visitors,
                date,
                startTime,
                endTime,
                isAdminCreated: true, // Flag to indicate admin created this visit
            });

            const newVisit: Visit = res.data;
            setVisits([newVisit, ...visits]);
            
            // Reset form
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setEmail('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setSelectedSessionId('');
            setSelectedInstitution(null);
            setSelectedPackage('');
            setSpecialRequest('');
            setVisitors('1 person');
            setTotalCost(0);
            
            alert('Visit created successfully!');
        } catch (err) {
            console.error(err);
            alert('Could not create visit.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin — Manage Visits</h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                    <strong>Admin Privilege:</strong> You can create visits for any date and time without restrictions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Date *
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time *
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Visitors
                    </label>
                    <select
                        value={visitors}
                        onChange={(e) => setVisitors(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option>1 person</option>
                        <option>2 people</option>
                        <option>3 people</option>
                        <option>4 people</option>
                        <option>5+ people</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                    </label>
                    <select
                        value={selectedInstitution?.id || ''}
                        onChange={handleInstitutionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Institution</option>
                        {institutions.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                                {inst.name}
                            </option>
                        ))}
                    </select>

                    {selectedInstitution?.packages && selectedInstitution.packages.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Package
                            </label>
                            <select
                                value={selectedPackage}
                                onChange={handlePackageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Package</option>
                                {selectedInstitution.packages.map((pkg) => (
                                    <option key={pkg.value} value={pkg.value}>
                                        {pkg.name} (Rp {pkg.price.toLocaleString('id-ID')})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {totalCost > 0 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                            Total Cost: <span className="font-bold">Rp {totalCost.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                    </label>
                    <textarea
                        rows={3}
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any specific areas to visit or special arrangements needed..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !firstName || !lastName || !email || !phoneNumber || !date || !startTime || !endTime}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                        loading || !firstName || !lastName || !email || !phoneNumber || !date || !startTime || !endTime
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {loading ? 'Creating Visit...' : 'Create Visit'}
                </button>
            </form>

            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Visits</h2>
                {visits.length === 0 ? (
                    <p className="text-gray-500">No visits created yet.</p>
                ) : (
                    <div className="space-y-4">
                        {visits.map((visit) => (
                            <div key={visit.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {visit.firstName} {visit.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">Email: {visit.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {visit.phoneNumber}</p>
                                        <p className="text-sm text-gray-600">Visitors: {visit.visitors}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date: {new Date(visit.date).toLocaleDateString('id-ID')}</p>
c                                        {(visit.sessionId || (startTime && endTime)) && (
                                            <p className="text-sm text-gray-600">
                                                Time: {/* This would need to be populated from session data or stored time */}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">Status: 
                                            <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                                visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {visit.status || 'pending'}
                                            </span>
                                        </p>
                                        {visit.specialRequest && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <span className="font-medium">Special Request:</span> {visit.specialRequest}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}