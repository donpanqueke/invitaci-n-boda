"use client"
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function WeddingInvitation() {
  const [images, setImages] = useState({
    couple: null as string | null,
    blessing: null as string | null,
    venue: null as string | null,
    story: [] as string[],
    gifts: [] as string[],
  })

  const [currentStoryImage, setCurrentStoryImage] = useState(0)
  const [currentGiftImage, setCurrentGiftImage] = useState(0)
  const [showEnvelopes, setShowEnvelopes] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    allergies: "",
    message: "",
    attending: "",
    guests: "1",
  })

  // Load saved data on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem("weddingImages")
    const savedRSVPs = localStorage.getItem("weddingRSVPs")

    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }
  }, [])

  // Save images to localStorage
  const saveImages = (newImages: typeof images) => {
    setImages(newImages)
    localStorage.setItem("weddingImages", JSON.stringify(newImages))
  }

  // Handle image upload
  const handleImageUpload = (section: keyof typeof images, index?: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (section === "story" || section === "gifts") {
            const newImages = { ...images }
            if (index !== undefined) {
              newImages[section][index] = result
            } else {
              newImages[section].push(result)
            }
            saveImages(newImages)
          } else {
            const newImages = { ...images, [section]: result }
            saveImages(newImages)
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const savedRSVPs = JSON.parse(localStorage.getItem("weddingRSVPs") || "[]")
    const newRSVP = {
      ...formData,
      timestamp: new Date().toISOString(),
    }
    savedRSVPs.push(newRSVP)
    localStorage.setItem("weddingRSVPs", JSON.stringify(savedRSVPs))

    alert("¡Gracias por confirmar tu asistencia!")
    setFormData({
      name: "",
      whatsapp: "",
      allergies: "",
      message: "",
      attending: "",
      guests: "1",
    })
  }

  // Story carousel navigation
  useEffect(() => {
    if (images.story.length > 1) {
      const interval = setInterval(() => {
        setCurrentStoryImage((prev) => (prev + 1) % images.story.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [images.story.length])

  // Gift carousel navigation
  useEffect(() => {
    if (images.gifts.length > 1) {
      const interval = setInterval(() => {
        setCurrentGiftImage((prev) => (prev + 1) % images.gifts.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [images.gifts.length])

  // Envelope animation trigger
  useEffect(() => {
    const handleScroll = () => {
      const giftSection = document.getElementById("gifts")
      if (giftSection) {
        const rect = giftSection.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setShowEnvelopes(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      {/* Envelope Animation */}
      {showEnvelopes && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 transform rotate-45 shadow-lg"></div>
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <section className="text-center mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200">
          <h1 className="text-6xl md:text-8xl font-serif text-amber-700 mb-6 tracking-wide">NOS CASAMOS</h1>
          <h2 className="text-3xl md:text-4xl font-serif text-amber-600 mb-8 italic">
            ESTEFANIA GUERRERO & ALBARO PACHON
          </h2>

          {/* First Image Upload */}
          <div className="mb-8">
            {images.couple ? (
              <img
                src={images.couple || "/placeholder.svg"}
                alt="Pareja"
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleImageUpload("couple")}
              />
            ) : (
              <div
                onClick={() => handleImageUpload("couple")}
                className="w-full max-w-md mx-auto h-64 bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors"
              >
                <span className="text-amber-600 font-serif text-lg">Haz clic para agregar imagen</span>
              </div>
            )}
          </div>

          <div className="text-lg md:text-xl text-amber-800 leading-relaxed font-serif space-y-4">
            <p className="italic">
              "El amor nunca se da por vencido jamás pierde la fe. Siempre tiene esperanzas y se mantiene firme en toda
              circunstancia."
            </p>
            <p className="text-amber-600 font-semibold">1 Corintios 13</p>
            <p className="mt-6">
              Nos casamos y queremos que nos acompañes en este gran día, Con la bendición de Dios y nuestros padres.
            </p>
          </div>

          {/* Second Image Upload */}
          <div className="mt-8">
            {images.blessing ? (
              <img
                src={images.blessing || "/placeholder.svg"}
                alt="Bendición"
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleImageUpload("blessing")}
              />
            ) : (
              <div
                onClick={() => handleImageUpload("blessing")}
                className="w-full max-w-md mx-auto h-64 bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors"
              >
                <span className="text-amber-600 font-serif text-lg">Haz clic para agregar imagen</span>
              </div>
            )}
          </div>
        </section>

        {/* Event Details */}
        <section className="text-center mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200">
          <div className="text-2xl md:text-3xl text-amber-700 mb-6 font-serif">📅 14 de Noviembre 2025 - 5:00 PM</div>
          <h3 className="text-3xl md:text-4xl font-serif text-amber-600 mb-6 italic">Lugar</h3>
          <p className="text-2xl text-amber-800 font-serif mb-8">Hacienda la Esperanza</p>

          {/* Venue Image Upload */}
          {images.venue ? (
            <img
              src={images.venue || "/placeholder.svg"}
              alt="Hacienda la Esperanza"
              className="w-full max-w-lg mx-auto rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleImageUpload("venue")}
            />
          ) : (
            <div
              onClick={() => handleImageUpload("venue")}
              className="w-full max-w-lg mx-auto h-64 bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors"
            >
              <span className="text-amber-600 font-serif text-lg">Haz clic para agregar imagen del lugar</span>
            </div>
          )}
        </section>

        {/* RSVP Form */}
        <section className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200">
          <h3 className="text-4xl md:text-5xl font-serif text-amber-700 text-center mb-8 italic">
            Confirmar Asistencia
          </h3>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <Input
                placeholder="Nombre y Apellido"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-lg p-4 border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Input
                placeholder="Número de WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                required
                className="text-lg p-4 border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Textarea
                placeholder="Alergias o Intolerancias"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="text-lg p-4 border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Textarea
                placeholder="Mensaje para los novios"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="text-lg p-4 border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-lg font-serif text-amber-700 mb-3">¿Asistirás?</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="attending"
                    value="si"
                    checked={formData.attending === "si"}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="text-amber-600"
                    required
                  />
                  <span className="text-lg text-amber-800">Sí, allí estaré</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === "no"}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="text-amber-600"
                  />
                  <span className="text-lg text-amber-800">No podré estar</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-lg font-serif text-amber-700 mb-3">¿Cuántas personas?</label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full text-lg p-4 border border-amber-300 rounded-lg focus:border-amber-500 bg-white"
              >
                <option value="1">Una persona</option>
                <option value="2">Dos personas</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full text-xl py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-serif"
            >
              Confirmar Asistencia
            </Button>
          </form>
        </section>

        {/* Our Story */}
        <section className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200">
          <h3 className="text-4xl md:text-5xl font-serif text-amber-700 text-center mb-8 italic">Nuestra Historia</h3>

          {/* Story Carousel */}
          <div className="relative mb-8">
            {images.story.length > 0 ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={images.story[currentStoryImage] || "/placeholder.svg"}
                  alt={`Historia ${currentStoryImage + 1}`}
                  className="w-full h-96 object-cover"
                />
                {images.story.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.story.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStoryImage(index)}
                        className={`w-3 h-3 rounded-full ${index === currentStoryImage ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => handleImageUpload("story")}
                className="w-full h-96 bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors"
              >
                <span className="text-amber-600 font-serif text-lg">Haz clic para agregar imágenes de su historia</span>
              </div>
            )}

            {images.story.length > 0 && (
              <Button
                onClick={() => handleImageUpload("story")}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-serif"
              >
                Agregar más imágenes
              </Button>
            )}
          </div>

          <div className="text-lg text-amber-800 leading-relaxed font-serif space-y-6">
            <p>
              El destino comenzó a escribir nuestra historia el 20 de marzo de 2018, cuando un conocido en común le pasó
              mi contacto. Al principio, solo fueron mensajes por WhatsApp, conversaciones casuales y algunas
              invitaciones que yo rechazaba, hasta que un día le dije que, si realmente quería conocerme, debía ser en
              un lugar tranquilo donde pudiéramos mirarnos a los ojos.
            </p>
            <p>
              Así llegó el 14 de abril de 2018, nuestra primera cita. Compartimos una cena deliciosa, hablamos de
              nuestras vidas y reímos como si nos conociéramos de siempre. Esa noche, sin darnos cuenta, comenzamos a
              caminar juntos por el mismo sendero.
            </p>
            <p>
              Pasaron los meses y un día me preguntó qué me haría ilusión tener. Sin dudarlo, respondí: "un perro". El 2
              de julio de 2018 llegó Tonny, nuestro hijo perruno, para llenar nuestra casa de amor y convertirse en
              testigo fiel de cada capítulo que hemos escrito.
            </p>
            <p>
              Y entonces, llegó el momento más especial de todos… El 26 de julio de 2025, con el corazón latiendo
              fuerte, se arrodilló frente a mí y me sorprendió con la pregunta más hermosa: si quería convertirme en su
              esposa. Entre lágrimas de felicidad, le dije que sí. Y ese día, el amor que comenzó con un mensaje se
              convirtió en un compromiso para toda la vida.
            </p>
          </div>
        </section>

        {/* Gifts Section */}
        <section
          id="gifts"
          className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200 relative"
        >
          <h3 className="text-4xl md:text-5xl font-serif text-amber-700 text-center mb-8 italic">Regalos</h3>

          <div className="text-lg text-amber-800 leading-relaxed font-serif mb-8 text-center">
            <p className="mb-4">
              ¡Tu presencia en nuestro gran día es el mejor regalo que podríamos pedir! Sin embargo, si deseas ayudarnos
              a hacer realidad un sueño aún más grande, estamos planeando nuestra luna de miel en Europa, un destino que
              siempre hemos soñado conocer juntos.
            </p>
          </div>

          {/* Gift Carousel */}
          <div className="relative mb-8">
            {images.gifts.length > 0 ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={images.gifts[currentGiftImage] || "/placeholder.svg"}
                  alt={`Regalo ${currentGiftImage + 1}`}
                  className="w-full h-96 object-cover"
                />
                {images.gifts.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.gifts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentGiftImage(index)}
                        className={`w-3 h-3 rounded-full ${index === currentGiftImage ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => handleImageUpload("gifts")}
                className="w-full h-96 bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors"
              >
                <span className="text-amber-600 font-serif text-lg">Haz clic para agregar imágenes de Europa</span>
              </div>
            )}

            {images.gifts.length > 0 && (
              <Button
                onClick={() => handleImageUpload("gifts")}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-serif"
              >
                Agregar más imágenes
              </Button>
            )}
          </div>

          <Card className="bg-gradient-to-r from-yellow-100 to-amber-100 border-amber-300">
            <CardContent className="p-8 text-center">
              <div className="text-3xl mb-4">🎁</div>
              <h4 className="text-2xl font-serif text-amber-700 mb-4">¡Lluvia de sobres!</h4>
              <p className="text-lg text-amber-800 font-serif mb-2">Bancolombia Ahorros</p>
              <p className="text-lg text-amber-800 font-serif mb-2">Luciana Pachon</p>
              <p className="text-lg text-amber-800 font-serif">Celular: [Número de contacto]</p>
            </CardContent>
          </Card>
        </section>

        {/* Dress Code */}
        <section className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200">
          <h3 className="text-4xl md:text-5xl font-serif text-amber-700 text-center mb-8 italic">Dress Code</h3>

          <div className="text-center space-y-6">
            <div className="text-2xl text-amber-700 font-serif">
              <p className="mb-2">Elegante</p>
              <p>Formal</p>
            </div>

            <div className="text-lg text-amber-800 font-serif space-y-2">
              <p>❌ No beige</p>
              <p>❌ No dorado</p>
              <p>❌ No estampados</p>
              <p>❌ No blanco</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
