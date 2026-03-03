"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Save, Image as ImageIcon, Award } from "lucide-react";

type HeroSlide = {
  imageUrl: string;
  order: number;
  isVisible: boolean;
};

type Achievement = {
  name: string;
  shortDescription: string;
  imageUrl: string;
  order: number;
  isVisible: boolean;
};

type HomeContentResponse = {
  heroSlides: HeroSlide[];
  achievements: Achievement[];
};

const emptySlide: HeroSlide = {
  imageUrl: "",
  order: 0,
  isVisible: true,
};

const emptyAchievement: Achievement = {
  name: "",
  shortDescription: "",
  imageUrl: "",
  order: 0,
  isVisible: true,
};

export default function HomepageSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  async function fetchContent() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/home-content");
      const json = await res.json();
      const data: HomeContentResponse = json.data ?? { heroSlides: [], achievements: [] };

      setHeroSlides(data.heroSlides ?? []);
      setAchievements(data.achievements ?? []);
      setError("");
    } catch {
      setError("Failed to load homepage content");
      setHeroSlides([]);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  function addSlide() {
    setHeroSlides((prev) => [...prev, { ...emptySlide, order: prev.length }]);
  }

  function removeSlide(index: number) {
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  }

  function addAchievement() {
    setAchievements((prev) => [...prev, { ...emptyAchievement, order: prev.length }]);
  }

  function removeAchievement(index: number) {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides, achievements }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to save");
        setSaving(false);
        return;
      }

      const data: HomeContentResponse = json.data ?? { heroSlides: [], achievements: [] };
      setHeroSlides(data.heroSlides ?? []);
      setAchievements(data.achievements ?? []);
      setSuccess("Homepage content saved");
    } catch {
      setError("Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-slate-100">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Homepage Content</h1>
          <p className="text-slate-400">Manage slider images and achievements (all images are URL based).</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-[#071024] font-semibold rounded-xl transition-colors"
        >
          {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> Loading homepage content…
        </div>
      ) : (
        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ImageIcon size={18} className="text-cyan-300" /> Home Image Slider
                </h2>
                <p className="text-slate-400 text-sm mt-1">Add slideshow images for homepage.</p>
              </div>
              <button
                onClick={addSlide}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 rounded-lg text-sm"
              >
                <Plus size={15} /> Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {heroSlides.map((slide, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Image URL</label>
                        <input
                          type="url"
                          value={slide.imageUrl}
                          onChange={(e) =>
                            setHeroSlides((prev) =>
                              prev.map((x, i) => (i === index ? { ...x, imageUrl: e.target.value } : x))
                            )
                          }
                          className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          placeholder="https://example.com/slide.jpg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Order</label>
                          <input
                            type="number"
                            value={slide.order}
                            onChange={(e) =>
                              setHeroSlides((prev) =>
                                prev.map((x, i) => (i === index ? { ...x, order: Number(e.target.value) } : x))
                              )
                            }
                            className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>

                        <div className="flex items-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setHeroSlides((prev) =>
                                prev.map((x, i) => (i === index ? { ...x, isVisible: !x.isVisible } : x))
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              slide.isVisible
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-slate-600/30 text-slate-300"
                            }`}
                          >
                            {slide.isVisible ? "Visible" : "Hidden"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt="slide preview" className="w-28 h-20 rounded-lg object-cover border border-white/10" />
                      ) : (
                        <div className="w-28 h-20 rounded-lg bg-white/5 border border-white/10" />
                      )}
                      <button
                        onClick={() => removeSlide(index)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {heroSlides.length === 0 && (
                <div className="text-sm text-slate-500 border border-dashed border-white/15 rounded-xl p-5 text-center">
                  No slides yet. Click Add Slide.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award size={18} className="text-cyan-300" /> Our Achievements Carousel
                </h2>
                <p className="text-slate-400 text-sm mt-1">Fields: name, short description, image URL.</p>
              </div>
              <button
                onClick={addAchievement}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 rounded-lg text-sm"
              >
                <Plus size={15} /> Add Achievement
              </button>
            </div>

            <div className="space-y-4">
              {achievements.map((item, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          setAchievements((prev) =>
                            prev.map((x, i) => (i === index ? { ...x, name: e.target.value } : x))
                          )
                        }
                        className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="Achievement title"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Short Description</label>
                      <input
                        type="text"
                        value={item.shortDescription}
                        onChange={(e) =>
                          setAchievements((prev) =>
                            prev.map((x, i) =>
                              i === index ? { ...x, shortDescription: e.target.value } : x
                            )
                          )
                        }
                        className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="Short description"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Image URL</label>
                      <input
                        type="url"
                        value={item.imageUrl}
                        onChange={(e) =>
                          setAchievements((prev) =>
                            prev.map((x, i) => (i === index ? { ...x, imageUrl: e.target.value } : x))
                          )
                        }
                        className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="https://example.com/achievement.jpg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setAchievements((prev) =>
                            prev.map((x, i) => (i === index ? { ...x, isVisible: !x.isVisible } : x))
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          item.isVisible
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-600/30 text-slate-300"
                        }`}
                      >
                        {item.isVisible ? "Visible" : "Hidden"}
                      </button>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Order</label>
                      <input
                        type="number"
                        value={item.order}
                        onChange={(e) =>
                          setAchievements((prev) =>
                            prev.map((x, i) => (i === index ? { ...x, order: Number(e.target.value) } : x))
                          )
                        }
                        className="mt-1 w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div className="justify-self-end">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt="achievement preview"
                          className="w-28 h-20 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-28 h-20 rounded-lg bg-white/5 border border-white/10" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {achievements.length === 0 && (
                <div className="text-sm text-slate-500 border border-dashed border-white/15 rounded-xl p-5 text-center">
                  No achievements yet. Click Add Achievement.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
