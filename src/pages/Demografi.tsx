
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Building2 } from 'lucide-react';
import { DemografiProvinceManagement } from '@/components/Demografi/DemografiProvinceManagement';
import { DemografiRegencyManagement } from '@/components/Demografi/DemografiRegencyManagement';
import { useDemografiCountries } from '@/hooks/useDemografiCountries';

export default function Demografi() {
  const { countries, isLoading } = useDemografiCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Set default to Indonesia when countries are loaded
  React.useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const indonesia = countries.find(c => c.kode === 'ID');
      if (indonesia) {
        setSelectedCountry(indonesia.id);
      }
    }
  }, [countries, selectedCountry]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Demografi</h1>
            <p className="text-gray-600">Kelola data provinsi dan kabupaten</p>
          </div>
        </div>
      </div>

      {/* Country Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Pilih Negara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Pilih negara" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{country.nama}</span>
                      {country.nama_lokal && country.nama_lokal !== country.nama && (
                        <span className="text-gray-500">({country.nama_lokal})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCountry && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Negara terpilih:</span>
                <span className="font-medium">
                  {countries.find(c => c.id === selectedCountry)?.nama}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Provinces and Regencies */}
      {selectedCountry && (
        <Tabs defaultValue="provinces" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="provinces" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Provinsi
            </TabsTrigger>
            <TabsTrigger value="regencies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Kabupaten
            </TabsTrigger>
          </TabsList>

          <TabsContent value="provinces">
            <DemografiProvinceManagement countryId={selectedCountry} />
          </TabsContent>

          <TabsContent value="regencies">
            <DemografiRegencyManagement countryId={selectedCountry} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
