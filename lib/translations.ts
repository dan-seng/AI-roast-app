export type UiLanguage = "eng" | "amh";

export const UI_LANGUAGES: { value: UiLanguage; label: string; nativeLabel: string }[] = [
  { value: "eng", label: "English", nativeLabel: "English" },
  { value: "amh", label: "Amharic", nativeLabel: "አማርኛ" },
];

const t = {
  // Navbar
  "nav.create": { eng: "Create", amh: "ፍጠር" },
  "nav.myRoasts": { eng: "My Roasts", amh: "የኔ ሮስቶች" },
  "nav.profile": { eng: "Profile", amh: "ፕሮፋይል" },

  // Home hero (unauthenticated)
  "hero.welcomeTo": { eng: "Welcome to", amh: "እንኳን ወደ" },
  "hero.roastBetter": { eng: "Roast Better.\nShare Faster.", amh: "በተሻለ ሁኔታ ሮስት አድርግ።\nበፍጥነት አጋራ።" },
  "hero.description": {
    eng: "AI-powered roasts with intensity control, language options, and export-ready visuals for social media.",
    amh: "በ AI የሚንቀሳቀሱ ሮስቶች፣ ከጥንካሬ መቆጣጠሪያ፣ የቋንቋ ምርጫዎች እና ለማህበራዊ ሚዲያ ዝግጁ የሆኑ እይታዎች ጋር።",
  },
  "hero.instantRoast": { eng: "Instant AI roast generation", amh: "ፈጣን AI ሮስት ማመንጨት" },
  "hero.signInOptions": { eng: "Google & GitHub sign-in", amh: "በGoogle እና GitHub መግባት" },
  "hero.savedHistory": { eng: "Saved history + export tracking", amh: "የተቀመጠ ታሪክ + የኤክስፖርት ክትትል" },
  "hero.createAccount": { eng: "Create Account", amh: "መለያ ፍጠር" },
  "hero.signIn": { eng: "Sign In", amh: "ግባ" },
  "hero.continueWith": { eng: "Continue with your preferred provider.", amh: "በምትመርጠው አቅራቢ ቀጥል።" },
  "hero.continueGoogle": { eng: "Continue with Google", amh: "በGoogle ቀጥል" },
  "hero.continueGitHub": { eng: "Continue with GitHub", amh: "በGitHub ቀጥል" },

  // Home page (authenticated)
  "home.styleLab": { eng: "Style-First Roast Lab", amh: "ሮስት ላብራቶሪ" },
  "home.createRoast": { eng: "Create Roast", amh: "ሮስት ፍጠር" },
  "home.uploadTune": { eng: "Upload, tune, roast, and export.", amh: "ስቀል፣ አስተካክል፣ ሮስት አድርግ እና ኤክስፖርት አድርግ።" },
  "home.controls": { eng: "Controls", amh: "መቆጣጠሪያዎች" },
  "home.controlsDesc": { eng: "Upload and configure your roast.", amh: "ስቀል እና ሮስትህን አዋቅር።" },
  "home.roastLanguage": { eng: "Roast Language", amh: "የሮስት ቋንቋ" },
  "home.roastLangDesc": { eng: "The roast will be generated in your selected language.", amh: "ሮስቱ በመረጥከው ቋንቋ ይፈጠራል።" },
  "home.generateRoast": { eng: "Generate Roast", amh: "ሮስት አመንጭ" },
  "home.roasting": { eng: "Roasting...", amh: "እየሮስት ነው..." },
  "home.result": { eng: "Result", amh: "ውጤት" },
  "home.roastReady": { eng: "Your roast is ready.", amh: "ሮስትህ ዝግጁ ነው።" },
  "home.roastPending": { eng: "Your roast will appear here after generation.", amh: "ሮስትህ ከማመንጨት በኋላ እዚህ ይታያል።" },
  "home.roastAgain": { eng: "Roast Again", amh: "እንደገና ሮስት አድርግ" },
  "home.reset": { eng: "Reset", amh: "ዳግም አስጀምር" },
  "home.export": { eng: "Export", amh: "ኤክስፖርት አድርግ" },
  "home.exportDesc": { eng: "Download a social media image or copy it directly to clipboard.", amh: "የማህበራዊ ሚዲያ ምስል አውርድ ወይም በቀጥታ ወደ ክሊፕቦርድ ቅዳ።" },
  "home.signOut": { eng: "Sign out", amh: "ውጣ" },

  // Roasts page
  "roasts.title": { eng: "My Roasts", amh: "የኔ ሮስቶች" },
  "roasts.description": { eng: "Saved roast history from your account.", amh: "ከመለያህ የተቀመጠ የሮስት ታሪክ።" },
  "roasts.empty": { eng: "No roasts yet.", amh: "ገና ሮስቶች የሉም።" },
  "roasts.loadMore": { eng: "Load More", amh: "ተጨማሪ ጫን" },
  "roasts.details": { eng: "Roast Details", amh: "የሮስት ዝርዝሮች" },
  "roasts.delete": { eng: "Delete", amh: "ሰርዝ" },
  "roasts.deleteRoast": { eng: "Delete Roast", amh: "ሮስቱን ሰርዝ" },
  "roasts.cancel": { eng: "Cancel", amh: "ሰርዝ" },
  "roasts.deleteTitle": { eng: "Delete Roast?", amh: "ሮስቱን ሰርዝ?" },
  "roasts.deleteWarning": {
    eng: "This action cannot be undone. This roast and its image will be permanently removed from your history.",
    amh: "ይህ እርምጃ መቀልበስ አይቻልም። ይህ ሮስት እና ምስሉ ከታሪክህ በቋሚነት ይወገዳሉ።",
  },
  "roasts.signInPrompt": { eng: "Please sign in to view your roasts.", amh: "ሮስቶችህን ለማየት እባክህ ግባ።" },
  "roasts.oldImage": { eng: "Image was not saved for this older roast.", amh: "ለዚህ የቆየ ሮስት ምስል አልተቀመጠም።" },
  "roasts.deleting": { eng: "Deleting...", amh: "እየሰረዘ ነው..." },

  // Profile page
  "profile.title": { eng: "Profile", amh: "ፕሮፋይል" },
  "profile.personalInfo": { eng: "Personal Info", amh: "የግል መረጃ" },
  "profile.displayName": { eng: "Display Name", amh: "የሚታይ ስም" },
  "profile.bio": { eng: "Bio", amh: "ባዮ" },
  "profile.saveChanges": { eng: "Save Changes", amh: "ለውጦችን አስቀምጥ" },
  "profile.saveDesc": {
    eng: "Make sure to save your preferences so they apply to all your future roasts.",
    amh: "ምርጫዎችህ ለሁሉም የወደፊት ሮስቶችህ እንዲተገበሩ ማስቀመጥህን አረጋግጥ።",
  },
  "profile.updateProfile": { eng: "Update Profile", amh: "ፕሮፋይል አዘምን" },
  "profile.saving": { eng: "Saving...", amh: "እያስቀመጠ ነው..." },
  "profile.dangerZone": { eng: "Danger Zone", amh: "አደገኛ ቦታ" },
  "profile.dangerDesc": {
    eng: "Permanently delete your account, history, and all generated assets.",
    amh: "መለያህን፣ ታሪክህን እና ሁሉንም የተፈጠሩ ሀብቶችህን በቋሚነት ሰርዝ።",
  },
  "profile.deleteAccount": { eng: "Delete Account", amh: "መለያ ሰርዝ" },
  "profile.updated": { eng: "Profile updated successfully!", amh: "ፕሮፋይል በተሳካ ሁኔታ ተዘምኗል!" },
  "profile.deleteConfirmTitle": { eng: "Are you absolutely sure?", amh: "ሙሉ በሙሉ እርግጠኛ ነህ?" },
  "profile.deleteConfirmDesc": {
    eng: "This action cannot be undone. All your roasts, images, and personal data will be permanently deleted.",
    amh: "ይህ እርምጃ መቀልበስ አይቻልም። ሁሉም ሮስቶችህ፣ ምስሎችህ እና የግል ውሂብህ በቋሚነት ይወገዳሉ።",
  },
  "profile.yesDelete": { eng: "Yes, Delete It", amh: "አዎ፣ ሰርዘው" },
  "profile.signInPrompt": {
    eng: "Please sign in to view and manage your profile settings.",
    amh: "የፕሮፋይል ቅንብሮችህን ለማየት እና ለማስተዳደር እባክህ ግባ።",
  },
  "profile.profileAccess": { eng: "Profile Access", amh: "የፕሮፋይል መዳረሻ" },
  "profile.signInSecure": { eng: "Sign in securely", amh: "በአስተማማኝ ሁኔታ ግባ" },

  // Intensity labels
  "intensity.mild": { eng: "Mild", amh: "መለስተኛ" },
  "intensity.medium": { eng: "Medium", amh: "መካከለኛ" },
  "intensity.savage": { eng: "Savage", amh: "ኃይለኛ" },
  "intensity.poetic": { eng: "Poetic", amh: "ግጥማዊ" },

  // Auth
  "auth.signedIn": { eng: "Signed in", amh: "ገብተሃል" },
  "auth.user": { eng: "User", amh: "ተጠቃሚ" },
  "auth.signIn": { eng: "Sign in", amh: "ግባ" },
  "auth.signOut": { eng: "Sign out", amh: "ውጣ" },

  // Upload
  "upload.uploading": { eng: "Uploading...", amh: "እየሰቀለ ነው..." },
  "upload.change": { eng: "Change", amh: "ለውጥ" },

  // Common labels
  "common.intensity": { eng: "Intensity", amh: "ጥንካሬ" },
  "common.language": { eng: "Language", amh: "ቋንቋ" },

  // Intensity labels (reused in slider + roasts page)
  "intensityLabel.mild": { eng: "Mild", amh: "መለስተኛ" },
  "intensityLabel.medium": { eng: "Medium", amh: "መካከለኛ" },
  "intensityLabel.savage": { eng: "Savage", amh: "ኃይለኛ" },
  "intensityLabel.poetic": { eng: "Poetic", amh: "ግጥማዊ" },

  // Intensity descriptions
  "intensityDesc.mild": { eng: "Gentle and playful", amh: "ለስላሳ እና አስቂኝ" },
  "intensityDesc.medium": { eng: "Witty and clever", amh: "ብልህ እና ቀልጣፋ" },
  "intensityDesc.savage": { eng: "Brutally honest", amh: "እጅግ ሐቀኛ" },
  "intensityDesc.poetic": { eng: "Beautifully cutting", amh: "በሚያምር ሁኔታ የሚወቅጥ" },

  // Slider labels
  "slider.roastIntensity": { eng: "Roast Intensity", amh: "የሮስት ጥንካሬ" },
  "slider.roastLanguage": { eng: "Roast Language", amh: "የሮስት ቋንቋ" },
};

export type TranslationKey = keyof typeof t;

export function translate(key: TranslationKey, lang: UiLanguage): string {
  return t[key]?.[lang] ?? t[key]?.eng ?? key;
}
