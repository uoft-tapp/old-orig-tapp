namespace :db do
  namespace :seed do
    task chass: :environment do
      importer = ChassImporter.new("seeds/mock_chass")
      puts "Mock CHASS data import successful!"
    end
  end
  namespace :csv do
    task cdf: :environment do
      generator = CSVGenerator.new
      generator.generate_cdf_info
    end
    task offers: :environment do
      generator = CSVGenerator.new
      generator.generate_offers
    end
    task transcript_access: :environment do
      generator = CSVGenerator.new
      generator.generate_transcript_access
    end
  end

end
