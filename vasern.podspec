require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "vasern"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  vaserncd ..
                   DESC
  s.homepage     = "https://github.com/vasern/vasern"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Vasern" => "hieunc@inverr.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/vasern/vasern.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,mm}"
  s.requires_arc = true
  s.static_framework = true

  s.dependency "React"
	
  # s.dependency "..."
end
