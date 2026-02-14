"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function LocationPicker({ value, onChange, className = "" }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDetectLocation = () => {
        setLoading(true);
        setError("");

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Use OpenStreetMap Nominatim API for reverse geocoding (free, no key required)
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    if (!res.ok) throw new Error("Failed to fetch address");

                    const data = await res.json();
                    const address = data.address;

                    const city = address.city || address.town || address.village || address.county;
                    const state = address.state;
                    const country = address.country;

                    const formattedLocation = [city, state, country].filter(Boolean).join(", ");

                    onChange(formattedLocation);
                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch address details");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    return (
        <div className={`location-picker ${className}`} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter city or detect location"
                    style={{ paddingRight: '2.5rem' }}
                />
                <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={loading}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--primary-red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title="Detect current location"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                </button>
            </div>
            {error && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
}
