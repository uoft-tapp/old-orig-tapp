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
      puts "CDF info CSV download success"
    end
    task offers: :environment do
      generator = CSVGenerator.new
      generator.generate_offers
      puts "Offer CSV download success"
    end
    task transcript_access: :environment do
      generator = CSVGenerator.new
      generator.generate_transcript_access
      puts "Transcript Access CSV download success"
    end
  end

end
