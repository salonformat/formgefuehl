# Formgefühl

Eine kleine Liebeserklärung von **Salon Format** an die Wiener Werkstätte. Eine interaktive Browser-Erfahrung: aus einem selbst gestalteten Zeichen wird ein Muster, aus dem Muster ein Raum.

## Erleben

1. Ein 5 × 5 Zeichen gestalten: Felder wechseln zwischen Papier, Tintenschwarz und Akzentfarbe.
2. Die unmittelbare Wirkung der Wiederholung beobachten – den **Rapport** entdecken.
3. Den eigenen Entwurf als räumliche Komposition betreten; Material und Maßstab verändern.
4. Über die Verbindung von Entwurf, Handwerk und Alltag zum **Gesamtkunstwerk** nachdenken.
5. Das persönliche Muster als PNG-Druck (1800 × 2400 px) mitnehmen.

Deutsch und Englisch mit Sprachwahl oben rechts. Native Browser-Zurück/Vorwärts-Navigation zwischen allen Stationen; ein Link zu allen Salon-Format-Projekten bleibt sichtbar. Desktop, Touch und Tastatur. Ton startet nur auf ausdrücklichen Klick. Bewegung kann reduziert werden. Ohne WebGL erscheint eine zweidimensionale Musteransicht. Kein Tracking, keine Konten, keine Übertragung persönlicher Entwürfe.

## Lokal starten

Node.js 22.12+ oder 24:

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
npm test
```

Die Dateien in `dist/` lassen sich auf einem statischen Webhost bereitstellen. Keine API-Schlüssel erforderlich. Der Produktionsbuild lädt keine externen Schriften oder Bibliotheken. GitHub ist die Sicherung des Quellcodes; eine öffentliche Veröffentlichung erfolgt separat.

## Gestaltung

Della Respira, Papierweiß, Tintenschwarz, Zinnoberrot, Messinggelb und Rauchblau. Eine reduzierte Salon-Format-Oberfläche trägt eine räumliche Entdeckungsreise. Vite + Three.js, ohne UI-Framework.

## Eigenständigkeit und Quellen

Ein unabhängiges Vermittlungsprojekt. **Kein Auftrag und keine Kooperation mit dem MAK.** Keine übernommenen Museumsbilder, Archivscans, historischen Mustervorlagen oder Museumslogos. Alle interaktiven Muster und Raumkompositionen sind neu erzeugte Geometrien. Der Raum ist keine historische Rekonstruktion.

Die historische Einordnung wird in eigenen Worten vermittelt; Museumseiten sind ausschließlich weiterführende Links. Fachliche Quellen und gestalterische Referenzen: [REFERENCES.md](REFERENCES.md).

Die lokal eingebundene Schrift Della Respira steht unter SIL Open Font License; siehe `public/fonts/OFL.txt`. Abhängigkeiten behalten ihre eigenen Lizenzen. Projektgestaltung und Inhalte: Salon Format.

## Dateien

- `src/main.js`: Ablauf, Bedienung, Texte, Audio und Druckexport
- `src/scene.js`: räumliche Darstellung, Materialien, reduzierte Bewegung, WebGL-Fallback
- `src/pattern.js`: eigene parametrische Muster
- `src/style.css`: Salon-Format-Gestaltung und responsive Darstellung
- `PRODUCT.md` / `DESIGN.md`: verbindlicher Projekt- und Gestaltungsrahmen

## Für eine spätere Präsentation beim MAK

Der Prototyp vermittelt die Beziehungen zwischen Zeichen, Wiederholung, Material und Raum. Eine spätere Zusammenarbeit könnte gemeinsam ausgewählte historische Objekte ergänzen. Dafür müssten Auswahl, fachliche Freigabe und Bildnutzung mit dem jeweiligen Rechteinhaber geklärt werden; solche Materialien sind in dieser Version nicht enthalten.
