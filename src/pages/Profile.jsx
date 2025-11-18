import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../services/api";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await Api.getProfile(username);
        setProfile(res.profile);
      } catch (e) {
        console.error("getProfile error:", e);
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) return <p style={{ padding: 24 }}>Loading profile...</p>;

  if (err) {
    return (
      <main style={{ padding: 24 }}>
        <p><strong>Error loading user.</strong></p>
        <p style={{ color: "#888", fontSize: 14 }}>
          {String(err.message || err)}
        </p>
      </main>
    );
  }

  if (!profile) return <p style={{ padding: 24 }}>No profile found.</p>;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar author={profile} />
        <h1>@{profile.username}</h1>
      </div>
      <p style={{ marginTop: 12, color: "#555" }}>
        {profile.bio || "This user has no bio yet."}
      </p>
    </main>
  );
}
