import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/CreateTrip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey, getValidationError } from "~/lib/utils";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { redirect, useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,latlng,flag,maps");
  const data = await response.json();

  return data?.map((country: any) => ({
    // name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};
const createTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    duration: 0,
    groupType: "",
    travelStyle: "",
    interest: "",
    budget: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const countryData = countries.map((country) => ({
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates: countries.find((c: Country) => c.value === formData.country)?.coordinates || [],
    },
  ];

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const errorMessage = getValidationError(formData);
    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      setError("You must be signed in to create a trip you will be redirected in 2 seconds...");
      setLoading(false);
      return setTimeout(() => {
        redirect("/sign-in");
      }, 2000);
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else console.log("failed to generate a trip");
    } catch (error) {
      console.log("Error generating trip", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header title="Add a New Trip" description="View and edit AI-generated travel plans" />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div className="map-field">
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective shapeData={world_map} dataSource={mapData} shapePropertyPath="name" shapeDataPath="country" shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }} />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="country-field">
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                const selected = countries.map((country) => country.value).includes(e.value || "");

                if (selected) {
                  handleChange("country", e.value!);
                } else {
                  handleChange("country", "");
                  setError("Please select a valid country");
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countries
                    .filter((country) => country.value.toLowerCase().includes(query))
                    .map((country) => ({
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div className="duration-field">
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              id="duration"
              name="duration"
              placeholder="Enter a number of days (1-10)"
              className="form-input placeholder:text-gray-100"
              min={1}
              max={10}
              onChange={(e) => {
                if (+e.target.value >= 1 && +e.target.value <= 10) {
                  handleChange("duration", +e.target.value);
                }
              }}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ value: "value", text: "text" }}
                placeholder={`Select ${formatKey(key)}`}
                className="combo-box"
                change={(e: { value: string | undefined }) => {
                  const selected = comboBoxItems[key].includes(e.value || "");

                  if (selected) {
                    handleChange(key, e.value!);
                  } else {
                    handleChange(key, "");
                    setError(`Please select a valid ${formatKey(key)}`);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
              />
            </div>
          ))}
          <div className="bg-gray-200 h-px w-full" />
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent type="submit" className="button-class !h-12 !w-full" disabled={loading}>
              <img src={`/assets/icons/${loading ? "loader" : "magic-star"}.svg`} alt="button icon" className={cn("size-5", { "animate-spin": loading })} />
              <span className="p-16-semibold text-white">{loading ? "Generating..." : "Generate Trip"}</span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default createTrip;
