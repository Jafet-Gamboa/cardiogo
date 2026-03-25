import React from "react";
import { X, Pill, Droplet, Syringe, TestTube, Package, Hash, Check, Save } from "lucide-react";

const EditMedicineModal = ({
  formData,
  setFormData,
  error,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  return (
    <div className="p-6 sm:p-8">

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-danger-light border-l-4 border-danger rounded-xl flex items-start gap-3 animate-fadeIn">
          <div className="bg-danger text-white rounded-full p-1 mt-0.5">
            <X className="w-4 h-4" />
          </div>
          <p className="text-danger font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {/* Información Básica */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Información Básica
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Nombre Comercial */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Pill className="w-4 h-4 text-success" />
                Nombre Comercial <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ej: Paracetamol 500mg"
                  value={formData.nombreComercial}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreComercial: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                />
                <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
              </div>
            </div>

            {/* Concentración */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Droplet className="w-4 h-4 text-success" />
                Concentración <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ej: 500mg, 250mg/5ml"
                  value={formData.concentracion}
                  onChange={(e) =>
                    setFormData({ ...formData, concentracion: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                />
                <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
              </div>
            </div>

            {/* Principio Activo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <TestTube className="w-4 h-4 text-success" />
                Principio Activo <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ej: Acetaminofén"
                  value={formData.principioActivo}
                  onChange={(e) =>
                    setFormData({ ...formData, principioActivo: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                />
                <TestTube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Presentación y Administración */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-light">
            <h3 className="text-base sm:text-lg font-bold text-gray-dark">
              Presentación y Administración
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Vía Administración */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Syringe className="w-4 h-4 text-success" />
                Vía de Administración <span className="text-danger">*</span>
              </label>

              <div className="relative group">
                <select
                  value={formData.via}
                  onChange={(e) =>
                    setFormData({ ...formData, via: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer hover:border-success/30"
                >
                  <option value="" disabled>
                    Selecciona una vía...
                  </option>
                  <option value="Oral">Oral</option>
                  <option value="Tópica">Tópica</option>
                  <option value="Inhalatoria">Inhalatoria</option>
                </select>

                <Syringe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-success transition-colors" />

                <svg
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {formData.via && (
                <p className="text-xs text-success flex items-center gap-1">
                  <Check className="w-3 h-3" /> Vía seleccionada
                </p>
              )}
            </div>

            {/* Forma Farmacéutica */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Package className="w-4 h-4 text-success" />
                Forma Farmacéutica <span className="text-danger">*</span>
              </label>

              <div className="relative group">
                <select
                  value={formData.formaFarmaceutica}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      formaFarmaceutica: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pl-11 pr-10 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark appearance-none cursor-pointer hover:border-success/30"
                >
                  <option value="" disabled>
                    Selecciona una forma...
                  </option>
                  <option value="Tableta">Tableta</option>
                  <option value="Cápsula">Cápsula</option>
                  <option value="Jarabe">Jarabe</option>
                  <option value="Inyección">Inyección</option>
                  <option value="Ampolla">Ampolla</option>
                  <option value="Inhalador">Inhalador</option>
                  <option value="Crema">Crema</option>
                  <option value="Ungüento">Ungüento</option>
                  <option value="Gel">Gel</option>
                  <option value="Parche">Parche</option>
                </select>

                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none group-focus-within:text-success transition-colors" />

                <svg
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {formData.formaFarmaceutica && (
                <p className="text-xs text-success flex items-center gap-1">
                  <Check className="w-3 h-3" /> Forma seleccionada
                </p>
              )}
            </div>

            {/* Contenido Empaque */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                <Hash className="w-4 h-4 text-success" />
                Contenido del Empaque <span className="text-danger">*</span>
              </label>

              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ej: 20 tabletas, 100ml, 30 cápsulas"
                  value={formData.contenidoEmpaque}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contenidoEmpaque: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pl-11 bg-gray-light border-2 border-gray-light rounded-xl outline-none focus:border-success focus:bg-white transition-all text-primary-dark placeholder:text-gray-medium hover:border-success/30"
                />
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium group-focus-within:text-success transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN */}
      <button
        type="button"
         onClick={async () => {
          const result = await onSubmit(); // handleAdd o handleEdit

          if (result.success) {
            onSuccess?.(result.message);
            onClose?.();
          } else {
            // Mostrar el error en UI del modal
            setMensajeError?.(result.message);
          }
        }}
        className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-success to-success-dark text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
      >
        <Save className="w-5 h-5 sm:w-6 sm:h-6" />
        Guardar Cambios
      </button>

      <p className="text-center text-xs text-gray-medium mt-4">
        Los campos marcados con <span className="text-danger">*</span> son obligatorios
      </p>
    </div>
  );
};

export default EditMedicineModal;
