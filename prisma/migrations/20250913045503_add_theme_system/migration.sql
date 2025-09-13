-- CreateTable
CREATE TABLE "public"."themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "colorScheme" JSONB NOT NULL,
    "typography" JSONB,
    "spacing" JSONB,
    "borders" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "tags" TEXT[],
    "preview" TEXT,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."theme_settings" (
    "id" TEXT NOT NULL,
    "activeThemeId" TEXT,
    "allowUserThemes" BOOLEAN NOT NULL DEFAULT true,
    "enableDarkMode" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "public"."themes"("slug");

-- AddForeignKey
ALTER TABLE "public"."themes" ADD CONSTRAINT "themes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."theme_settings" ADD CONSTRAINT "theme_settings_activeThemeId_fkey" FOREIGN KEY ("activeThemeId") REFERENCES "public"."themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
